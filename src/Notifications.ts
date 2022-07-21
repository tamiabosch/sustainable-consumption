import { LocalNotifications } from '@capacitor/local-notifications'




class Notifications {
  public async schedule(hour: number, message: string, startDate: Date) {
    console.log('schedule')
    try {
      // Request/ check permissions
      if (!(await LocalNotifications.requestPermissions()).display) return;

      // Clear old notifications in prep for refresh (OPTIONAL)
      const pending = await LocalNotifications.getPending();
      console.log("pending: " + pending.notifications.length, pending)
      if (pending.notifications.length > 0)
         await LocalNotifications.cancel(pending);

      await LocalNotifications.schedule({
        notifications: [{
          title: 'SuCo App Reminder',
          body: message,
          id: 1,
          schedule: {
            at: new Date(Date.now() + 1000 * 10), // in 10 seconds
            repeats: true,
            every: "second", // repeats every minute
            count: 3, // limits to 3 times
            allowWhileIdle: true,
          },
          //   on: {
          //     day: 1, // 0-6: Sunday-Saturday
          //     hour: 12,
          //     minute: 30,
          // },
          
          // schedule: {
          //      // Schedule the notification to be displayed at 5 sec from now
					// at: new Date(Date.now() + 5000),
          // }
        }]
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Notifications()
