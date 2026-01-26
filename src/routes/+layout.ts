import posthog from 'posthog-js';
import { browser, dev } from '$app/environment';

export const load = async () => {
  if (browser && !dev) {
    posthog.init(
      'phc_gYcgSwoPcq2oz7F9Byq7N4pVCPS1WsfMKuqXplmoDVs',
      {
        api_host: '/relay-oDVs',
        ui_host: 'https://us.posthog.com',
        person_profiles: 'always',
        persistence: 'localStorage'
      }
    )
  }

  return
};
