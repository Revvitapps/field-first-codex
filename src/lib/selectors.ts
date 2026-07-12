import type { Contact, DailyLog, Notification, Persona, Project, Role, VisibilityLevel } from "@/lib/domain";

export function roleForPersona(persona: Persona): Role {
  return persona;
}

export function canSeeVisibilityLevel(persona: Persona, level: VisibilityLevel): boolean {
  if (persona === "Homeowner") {
    return level === 3;
  }

  if (persona === "Foreman") {
    return level <= 2;
  }

  return true;
}

export function filterProjectsForPersona(projects: Project[], persona: Persona) {
  return projects.filter((project) => project.personaAccess.includes(persona));
}

export function filterNotificationsForPersona(notifications: Notification[], persona: Persona) {
  const role = roleForPersona(persona);
  return notifications.filter(
    (notification) =>
      notification.recipientRoles.includes(role) && canSeeVisibilityLevel(persona, notification.visibilityLevel),
  );
}

export function filterContactsForProject(contacts: Contact[], projectId: string) {
  return contacts.filter((contact) => contact.projectIds.includes(projectId));
}

export function filterLogsForPersona(dailyLogs: DailyLog[], persona: Persona) {
  return dailyLogs.filter(() => canSeeVisibilityLevel(persona, 2) || persona !== "Homeowner");
}

export function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
