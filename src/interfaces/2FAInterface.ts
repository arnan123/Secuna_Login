export interface TwoFAInterface {
  message: string;
  two_fa_qr_url: string;
  two_fa_enabled: boolean;
  access_token: string;
}
