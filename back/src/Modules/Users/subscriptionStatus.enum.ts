export enum SubscriptionStatus {
  ACTIVE = 'active', // La suscripción está al día.
  PAST_DUE = 'past_due', // El último pago falló, está en período de gracia.
  CANCELED = 'canceled', // La suscripción ha sido cancelada.
  NONE = 'none', // El usuario nunca se ha suscrito.
}
