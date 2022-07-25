import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications'


class Notifications {
  public async schedule(startDate: Date, peer: boolean) {
    console.log('schedule: ' + startDate.toString())
    try { // Request/ check permissions
      if (!(await LocalNotifications.requestPermissions()).display)
        return;


      // Clear old notifications in prep for refresh (OPTIONAL)
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel(pending);
      }
      const current = new Date();
      var relevantNotifications: LocalNotificationSchema[] = [];
      const startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 11, 0, 0) // Motag 11 Uhr
      const startReminder = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 3, 18, 30) // 4 Tage nach dem Start 18:30 Uhr
      const secondWeek = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate() + 7, 11, 0, 0); // Zweite Woche
      const secondReminder = new Date(secondWeek.getFullYear(), secondWeek.getMonth(), secondWeek.getDate() + 3, 18, 30) // 4 Tage nach dem Start 18:30 Uhr
      const thirdWeek = new Date(secondWeek.getFullYear(), secondWeek.getMonth(), secondWeek.getDate() + 7, 11, 0, 0); // Dritte Woche
      const thirdReminder = new Date(thirdWeek.getFullYear(), thirdWeek.getMonth(), thirdWeek.getDate() + 3, 18, 30); // Dritte Woche
      const end = new Date(thirdWeek.getFullYear(), thirdWeek.getMonth(), thirdWeek.getDate() + 7, 18, 0, 0);

      if (current < startTime) {
        console.log('startTime is in the future')
        relevantNotifications.push({
          title: 'SuCo Welcome',
          body: 'Studie startet, dein Thema der Woche ist verfügbar!',
          id: 2,
          schedule: {
            at: startTime, // erster Tag 25.07.2022
            allowWhileIdle: true
          }
        })
      }

      if (current < startReminder) {
        console.log('startReminder is in the future')
        relevantNotifications.push({
          title: 'SuCo Reminder',
          body: 'Hast du diese Woche schon deine Einkäufe eingetragen und Feedback gegeben?',
          id: 3,
          schedule: {
            at: startReminder, // 4 Tage nach dem Start 18:30 Uhr
            allowWhileIdle: true
          }
        })
      }

      if (current < secondWeek) {
        relevantNotifications.push({
          title: 'SuCo neue Woche',
          body: 'Es gibt ein neues Thema der Woche für dich!',
          id: 4,
          schedule: {
            at: secondWeek, // zweite Woche 11 Uhr
            allowWhileIdle: true
          }
        })
      }

      if (current < secondReminder) {
        relevantNotifications.push({
          title: 'SuCo Reminder',
          body: 'Hast du diese Woche schon deine Einkäufe eingetragen und Feedback gegeben?',
          id: 5,
          schedule: {
            at: secondReminder, // 4 Tage nach dem Start 18:30 Uhr
            allowWhileIdle: true
          }
        })
      }

      if (current < thirdWeek) {
        relevantNotifications.push({
            title: 'SuCo neue Woche',
            body: 'Fast geschafft, ein letztes Thema der Woche für dich!',
            id: 6,
            schedule: {
              at: thirdWeek,
                  allowWhileIdle: true
            }
        })
      }
      if (current < thirdReminder) {
        relevantNotifications.push({
          title: 'SuCo Reminder',
          body: 'Hast du diese Woche schon Eingekauft und etwas in die App eingetragen?',
          id: 7,
          schedule: {
            at: thirdReminder,
            allowWhileIdle: true
          }
        })
      }
      if (current < end) {
        relevantNotifications.push({
          title: 'SuCo Ende',
          body: 'Du hast deine Studie beendet, vielen Dank für deine Teilnahme!',
          id: 8,
          schedule: {
            at: end,
            allowWhileIdle: true
          }
        })
      }
      if (peer) {
        relevantNotifications.push({
          title: 'SuCo Feedback',
          body: 'Vergiss nicht auch mal in den Feedback Tab zu schauen, vielleicht gibt es was zu tun!',
          id: 9,
          schedule: {
            repeats: true,
            every: "week",
            on: { 
              weekday: 7,
              hour: 19
        },
            //count is not good with on method, wieso auch immer
          },
        })
      }
      //schedule only notfications that are in the future
      await LocalNotifications.schedule({
        notifications: relevantNotifications
      });

      const pendingAfterSchedule = await LocalNotifications.getPending();
      console.log("pending: " + pendingAfterSchedule.notifications.length, pendingAfterSchedule)
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Notifications()
