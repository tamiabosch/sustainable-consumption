import { LocalNotifications } from '@capacitor/local-notifications'


class Notifications {
  public async schedule(startDate: Date) {
    console.log('schedule')
    try { // Request/ check permissions
      if (!(await LocalNotifications.requestPermissions()).display) return;

      // Clear old notifications in prep for refresh (OPTIONAL)
      const pending = await LocalNotifications.getPending();
      console.log("pending: " + pending.notifications.length, pending)
      if (pending.notifications.length > 0){
        await LocalNotifications.cancel(pending);
      }

      // Start of the Week Task reminder
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'SuCo App Hinweis',
            body: 'Neues Thema der Woche ist verfügbar!',
            id: 1,
            
            schedule: {
              at: new Date(Date.now() + 1000 * 10), // in 10 seconds
              //repeats: true,
              every: "second", // repeats every minute
              count: 3, // limits to 3 times
              allowWhileIdle: true
            }
          },
          {
            title: 'SuCo App Reminder',
            body: 'Hast du diese Woche schon deine Einkäufe eingetragen?',
            id: 2,
            schedule: {
              at: new Date(Date.now() + 1000 * 20), // in 20 seconds
              //repeats: true,
              allowWhileIdle: true,
              every: "minute", // repeats every minute
              count: 3, // limits to 3 times
              on: {
                minute: 50
              },
            }
          }
        ]
      });
      const pending2 = await LocalNotifications.getPending();
      console.log("pending2: " + pending2.notifications.length, pending2)
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Notifications()
