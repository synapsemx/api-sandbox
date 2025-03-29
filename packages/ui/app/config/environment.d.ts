/**
 * Type declarations for
 *    import config from 'ui/config/environment'
 */
declare const config: {
  environment: string;
  modulePrefix: string;
  podModulePrefix: string;
  locationType: 'history' | 'hash' | 'none';
  rootURL: string;
  APP: {
    API_HOST: string;
  };
};

export default config;
