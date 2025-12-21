import { supabase } from './supabase';

export interface ButtonClickData {
  button_name: string;
  button_location: string;
  page_url: string;
  user_session: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  screen_resolution: string;
}

export const buttonTrackingService = {
  // Track button clicks
  async trackButtonClick(data: Omit<ButtonClickData, 'user_session' | 'device_type' | 'screen_resolution'>) {
    try {
      console.log('Tracking button click:', data);

      // Get device type
      const userAgent = navigator.userAgent;
      let device_type: 'mobile' | 'tablet' | 'desktop' = 'desktop';

      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        device_type = /iPad|Android(?=.*\bMobile\b)|Windows Phone|BlackBerry/i.test(userAgent) ? 'tablet' : 'mobile';
      }

      // Get screen resolution
      const screen_resolution = `${window.screen.width}x${window.screen.height}`;

      // Generate or get session ID
      let user_session = localStorage.getItem('analytics_session');
      if (!user_session) {
        user_session = 'session_' + Math.random().toString(36).substr(2, 9) + Date.now();
        localStorage.setItem('analytics_session', user_session);
      }

      const clickData = {
        ...data,
        user_session,
        device_type,
        screen_resolution
      };

      console.log('Inserting click data:', clickData);

      const { error } = await supabase
        .from('button_clicks')
        .insert([clickData]);

      if (error) {
        console.error('Error tracking button click:', error);
      } else {
        console.log('Button click tracked successfully');
      }
    } catch (error) {
      console.error('Error tracking button click:', error);
    }
  },

  // Track page views
  async trackPageView(page_url: string) {
    try {
      const userAgent = navigator.userAgent;
      let device_type: 'mobile' | 'tablet' | 'desktop' = 'desktop';

      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        device_type = /iPad|Android(?=.*\bMobile\b)|Windows Phone|BlackBerry/i.test(userAgent) ? 'tablet' : 'mobile';
      }

      const screen_resolution = `${window.screen.width}x${window.screen.height}`;

      let user_session = localStorage.getItem('analytics_session');
      if (!user_session) {
        user_session = 'session_' + Math.random().toString(36).substr(2, 9) + Date.now();
        localStorage.setItem('analytics_session', user_session);
      }

      const { error } = await supabase
        .from('traffic_analytics_extended')
        .insert([{
          page_url,
          user_session,
          device_type,
          screen_resolution,
          user_agent: userAgent,
          referrer: document.referrer || null
        }]);

      if (error) {
        console.error('Error tracking page view:', error);
      }
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }
};
