import { Contact, ContactTimelineItem } from "../types";

export interface LeadScoreCalculationResult {
  leadScore: number;
  scoreGrade: "Hot" | "Warm" | "Cold";
  status: "lead" | "contacted" | "customer" | "churned";
  scoreChanged: boolean;
  statusChanged: boolean;
  breakdown: {
    event: string;
    points: number;
  }[];
}

/**
 * Pure function that calculates a contact's Lead Score and Status based on
 * interaction activity and email responsiveness in the database timeline.
 */
export function calculateLeadScoreAndStatus(contact: Contact): LeadScoreCalculationResult {
  let score = 50; // Neutral base score
  const breakdown: { event: string; points: number }[] = [
    { event: "Base CRM Profile Score", points: 50 },
  ];

  const timeline = contact.timeline || [];

  // 1. Interaction activity and email responsiveness scoring
  timeline.forEach((item) => {
    switch (item.type) {
      case "reply_received":
        score += 25;
        breakdown.push({ event: "Email Reply Received (+25)", points: 25 });
        break;
      case "meeting_booked":
        score += 30;
        breakdown.push({ event: "Sales Meeting Booked (+30)", points: 30 });
        break;
      case "link_clicked":
        score += 15;
        breakdown.push({ event: "Email Link Clicked (+15)", points: 15 });
        break;
      case "email_opened":
        score += 10;
        breakdown.push({ event: "Email Opened (+10)", points: 10 });
        break;
      case "whatsapp_sent":
        score += 5;
        breakdown.push({ event: "WhatsApp Interaction (+5)", points: 5 });
        break;
      case "note_added":
        score += 3;
        breakdown.push({ event: "Sales Note Added (+3)", points: 3 });
        break;
      default:
        break;
    }
  });

  // 2. Activity Recency & Inactivity Decay
  let latestDate: Date | null = null;
  timeline.forEach((item) => {
    if (item.date) {
      const d = new Date(item.date);
      if (!isNaN(d.getTime())) {
        if (!latestDate || d > latestDate) {
          latestDate = d;
        }
      }
    }
  });

  if (!latestDate && contact.lastContacted && contact.lastContacted !== "Recently" && contact.lastContacted !== "Just imported") {
    const d = new Date(contact.lastContacted);
    if (!isNaN(d.getTime())) {
      latestDate = d;
    }
  }

  if (latestDate) {
    const diffMs = Date.now() - (latestDate as Date).getTime();
    const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    if (diffDays <= 3) {
      score += 12;
      breakdown.push({ event: `High Recency Bonus (${diffDays} days ago) (+12)`, points: 12 });
    } else if (diffDays <= 7) {
      score += 6;
      breakdown.push({ event: `Active Recency Bonus (${diffDays} days ago) (+6)`, points: 6 });
    } else if (diffDays > 30) {
      score -= 25;
      breakdown.push({ event: `Inactivity Decay (>30 days idle) (-25)`, points: -25 });
    } else if (diffDays > 14) {
      score -= 10;
      breakdown.push({ event: `Inactivity Decay (>14 days idle) (-10)`, points: -10 });
    }
  }

  // Clamping score between 0 and 100
  const finalScore = Math.min(100, Math.max(0, score));

  // Determine score grade
  let scoreGrade: "Hot" | "Warm" | "Cold" = "Warm";
  if (finalScore >= 80) {
    scoreGrade = "Hot";
  } else if (finalScore < 50) {
    scoreGrade = "Cold";
  }

  // Determine status based on activity & responsiveness
  let status = contact.status || "lead";
  const hasMeeting = timeline.some((t) => t.type === "meeting_booked");
  const hasReply = timeline.some((t) => t.type === "reply_received");
  const hasEmailEngagement = timeline.some((t) => ["reply_received", "link_clicked", "email_opened"].includes(t.type));

  if (hasMeeting || (hasReply && finalScore >= 80)) {
    if (status === "lead" || status === "contacted") {
      status = "customer";
    }
  } else if (hasEmailEngagement && status === "lead") {
    status = "contacted";
  } else if (finalScore <= 25 && status === "contacted") {
    status = "churned";
  }

  const scoreChanged = finalScore !== contact.leadScore || scoreGrade !== contact.scoreGrade;
  const statusChanged = status !== contact.status;

  return {
    leadScore: finalScore,
    scoreGrade,
    status,
    scoreChanged,
    statusChanged,
    breakdown,
  };
}
