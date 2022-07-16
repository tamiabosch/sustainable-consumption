import { IonContent, IonIcon, IonPage, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/react';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { contrastOutline, mapOutline, pricetagsOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Task } from '../models/Task';
import { useAuth } from '../service/authFirebase';
import { db } from '../service/firebaseConfig';

const Tab3: React.FC = () => {
  const [segment, setSegment] = useState<Task>(Task.CERTIFICATE);
  const { userId } = useAuth()
  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    const userRef = doc(db, "users", userId ? userId : '0');
    const getUserProfile = async () => {
      const userDoc = await getDoc(userRef);
      setUserData(userDoc.data() as User);
    }
    getUserProfile();
  }, [userId])

  console.log(userData)
  return (
    <IonPage>
      <Header title="Wöchentliche Aufgabe" />
      <IonContent fullscreen className='ion-padding'>
        <IonToolbar class='mb-4'>
          <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value as Task)}>
            <IonSegmentButton value={Task.CERTIFICATE}>{Task.CERTIFICATE}</IonSegmentButton>
            <IonSegmentButton value={Task.REGIONALITY}>{Task.REGIONALITY}</IonSegmentButton>
            <IonSegmentButton value={Task.SEASONALITY}>{Task.SEASONALITY}</IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        {{
          [Task.CERTIFICATE]: <CertificateText />,
          [Task.REGIONALITY]: <RegionalityText />,
          [Task.SEASONALITY]: <SeasonalityText />
        }[segment]}
      </IonContent>
    </IonPage >
  );
};

export default Tab3;

export const CertificateText = () => {
  return (
    <>
      <div className="mb-4 bg-blue-900 h-32 flex flex-row items-center justify-center">
        <IonIcon icon={pricetagsOutline} className="text-white text-4xl mr-4" />
        <h2 className="text-center text-2xl text-white font-bold">{Task.CERTIFICATE}</h2>
      </div>
      <h2 className='text-lg font-bold'>Allgeimeine Infos</h2>
      <p>Ein Bio-Siegel ist ein Qualitäts- und Zertifizierungszeichen, mit dem Erzeugnisse aus ökologischem Landbau gekennzeichnet werden. Die Berechtigung zur Verwendung eines Siegels wird durch den Herausgeber geregelt und ist an die Einhaltung bestimmter Standards und Bedingungen geknüpft. In der Landwirtschaft beispielsweise umfassen die Anforderungen an die Hersteller sowohl die Tierhaltung als auch den Pflanzenschutz.
        <br />
        Die beiden größten und am häufigsten anzutreffenden Siegel sind das deutsche und das europäische Bio-Siegel.
        Diese beiden staatlich kontrollierten Zertifikate gelten mit ihren Vorgaben für die Herstellung von Produkten und die Tierhaltung als vertrauenswürdig.
        Agrarverbände wie <b>Demeter</b>, <b>Bioland</b> oder <b>Naturland</b> haben im Vergleich dazu deutlich strengere Anforderungen und Kontrollverfahren für ihre Mitglieder.
        Durch den unterschiedlichen Strengheitsgrad der Siegel ist ihre Bedeutung für die Umwelt sehr unterschiedlich. Bei richtiger Handhabung versprechen sie artgerechte Tierhaltung und weniger Umweltbelastung.
        <br />
        Für den Verbraucher bedeutet das aber oft auch teurere Produkte, da die Einhaltung der Anforderungen mit höheren Kosten verbunden ist. Nicht jede Zertifizierung, die auf Produkten zu finden ist, unterliegt strengen Anforderungen.
        Daher ist es für die Verbraucher wichtig, sich beim Kauf über die Kriterien für die Vergabe des Zertifikats zu informieren.
        Der Trend zu Bio-Lebensmitteln wird oft missbraucht, vor allem von Discountern, wo viele Produkte mit Zertifikaten gekennzeichnet sind.
        Die Anforderungen an diese Zertifikate sind oft nicht einmal annähernd so hoch wie die der Öko-Verbände und dienen in erster Linie dem eigenen Image und höheren Gewinnen.
        In vielen Fällen erwecken sie nur den Anschein eines echten Bio-Produkts.
        <br />
        Nutzen Sie diesen Link, um sich über Bio-Siegel zu informieren: <a href="https://www.bio-siegel.de/">https://www.bio-siegel.de/</a>
      </p>
      <h2 className='text-lg font-bold'>Links</h2>
      <li>
        <ul><a href="google.com" className="href" target='_blank'>Test</a></ul>
        <ul><a href="google.com" className="href">Test</a></ul>
      </li>
    </>
  )
}

export const RegionalityText = () => {
  return (
    <>
      <div className="mb-4 bg-green-900 h-32 flex flex-row items-center justify-center">
        <IonIcon icon={mapOutline} className="text-white text-4xl mr-4" />
        <h2 className="text-center text-2xl text-white font-bold">{Task.REGIONALITY}</h2>
      </div>
      <h2 className='text-lg font-bold'>Allgeimeine Infos</h2>
      <p>
        Ein regionales Produkt wird in einem bestimmten geografischen Gebiet erzeugt, verarbeitet und vermarktet. Es ist also aus der Region - für die Region. Doch wie ist der Begriff "regional" definiert? Viele Menschen verstehen unter ihrer Region das große Gebiet um ihren Wohnort, zum Beispiel ihren Landkreis, ihr Bundesland oder bestimmte Naturräume wie die Bayerischen Alpen oder die Eifel.
        <br />
        Viele Menschen kaufen regionale Lebensmittel, weil sie die lokalen Erzeuger und Landwirte unterstützen wollen. Außerdem schätzen sie den Geschmack und die Frische von Obst und Gemüse, das in der Saison reif geerntet wird. Die Lebensmittel werden auf kurzen Transportwegen zu den Verbrauchern gebracht. Dies bietet den Kunden die Möglichkeit, klimafreundlich einzukaufen. Es ist daher ratsam, auf den Etiketten oder Websites der Hersteller nachzusehen, woher die Produkte stammen. Es lohnt sich auch, Wochenmärkte und Verkaufsstände zu besuchen, denn dort werden meist regionale und saisonale Produkte angeboten. Doch Vorsicht! Viele Produkte sind von hier oder aus der Region gekennzeichnet. Das kann auch regionaler Kaffee sein, denn er wird in der Nähe geröstet - die Kaffeebohnen kommen aber aus Übersee.
        <br />
        Hier noch ein paar Tipps für regionale Produkte: - Eiercode zeigt Bundesland - "Regionalfenster"
        (mehr: <a href='http://www.regionalfenster.de' target="_blank" rel="noreferrer" className='text-blue-500'>http://www.regionalfenster.de</a>) - Angabe des Erzeugers oder einer eindeutig identifizierbaren Region - geschützte Ursprungsbezeichnung (g.U.) - Siegel der Regionalinitiativen - Qualitätszeichen der Bundesländer
      </p>
      <h2 className='text-lg font-bold'>Links</h2>
      <li>
        <ul><a href="google.com" className="href" target='_blank'>Test</a></ul>
        <ul><a href="google.com" className="href">Test</a></ul>
      </li>
    </>
  )
}

export const SeasonalityText = () => {
  return (
    <>
      <div className="mb-4 bg-orange-500 h-32 flex flex-row items-center justify-center">
        <IonIcon icon={contrastOutline} className="text-white text-4xl mr-4" />
        <h2 className="text-center text-2xl text-white font-bold">{Task.SEASONALITY}</h2>
      </div>
      <h2 className='text-lg font-bold'>Allgeimeine Infos</h2>
      <p>
        Saisonalität bezieht sich auf die natürlichen, saisonalen Bedingungen in der Landwirtschaft. Dazu gehören z. B. klimatische Bedingungen wie Temperaturen und Niederschläge. Diese Bedingungen bestimmen, welche Pflanzen zu welcher Zeit wachsen können. Obst und Gemüse, das aufgrund der vorherrschenden Klimabedingungen angebaut und geerntet wird, wird im Allgemeinen als saisonal bezeichnet. Das bedeutet aber auch, dass je nach Region der Welt unterschiedliche Produkte saisonal verfügbar sind. Das ist nicht nur gut für uns, sondern auch für die Umwelt. Saisonal gekaufte Produkte sind gesünder und haben mehr Geschmack. Die Transportwege sind oft kürzer und die Umwelt wird bei der Produktion weniger belastet, weil weniger Ressourcen benötigt werden. Doch nun das Wichtigste: Wie können wir unsere Kaufentscheidungen auf saisonal verfügbare Produkte ausrichten? Saisonalität steht in engem Zusammenhang mit regional verfügbaren Produkten. Zunächst einmal ist es wichtig zu wissen, wann im Jahr welche Produkte in Ihrer Region erhältlich sind.
        <br />
        Mehr dazu erfahren Sie hier: <a href='https://www.regional-saisonal.de/saisonkalender' target='_blank' rel='noreferrer' className='text-blue-500' >https://www.regional-saisonal.de/saisonkalender</a>
        Außerdem lohnt sich immer ein Besuch auf dem örtlichen Bauernmarkt, denn dort verkaufen die Bauern meist nur ihre regionale Ernte und saisonale Produkte. So bekommen Sie Erdbeeren nur im Sommer, wenn sie frisch und reif sind. Die Erdbeeren, die Sie im Winter kaufen können, sind mit einem langen Transport oder hohem Ressourceneinsatz verbunden
      </p>
      <h2 className='text-lg font-bold'>Links</h2>
      <li>
        <ul><a href="https://www.regional-saisonal.de/saisonkalender" target='_blank' rel='noreferrer'>Test</a></ul>
        <ul><a href="https://www.regional-saisonal.de/saisonkalender" target='_blank' rel='noreferrer'>Test</a></ul>
      </li>
    </>
  )
}
