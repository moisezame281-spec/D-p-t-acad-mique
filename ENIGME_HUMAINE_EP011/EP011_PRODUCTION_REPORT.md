# EP011 : rapport de production

**L'Énigme humaine, épisode 011 : « Une machine peut-elle t'aimer ? »**

Produit le 25/11/2026. **Premier épisode au nouveau format**, demandé le 25/11 :
- **le ton « explication de prof »**, calqué sur la vidéo de référence (EasyMath) : texte adapté et voix plus expressive, en phrases courtes ;
- **le modèle « tableau vivant »** : un motion design simple, constant et rythmé, qui remplace les décors construits à chaque épisode.

On garde la voix d'homme B, le logo, la signature sonore, le carton de fin, les sources vérifiées et le kit de publication.

## 1. Livrables

| Fichier | Contenu |
|---|---|
| `EP011_MASTER_9x16.mp4` | 1080×1920, 30 i/s, H.264, AAC 48 kHz, **106,1 s** |
| `EP011_TIKTOK.mp4` / `EP011_YOUTUBE_SHORTS.mp4` | Identiques au master |
| `EP011_PROMO_15s.mp4` | 22,53 s : l'accroche, puis la question finale et le carton de fin |
| `EP011_EXTRAIT_1_BUBER.mp4` · `EP011_EXTRAIT_2_ETUDE.mp4` · `EP011_EXTRAIT_3_QUESTION.mp4` | Trois extraits courts (voir le kit) |
| `EP011_COVER.png` | Couverture : le titre sur le papier, le logo et le nom |
| `EP011_SUBTITLES.srt` | Sous-titres minutés au mot près |
| `EP011_SCRIPT.txt` | Le script fourni (original), la narration adaptée et le minutage temps par temps |
| `EP011_REFERENCES.md` / `EP011_AUDIO_LICENSES.md` | Sources vérifiées ; droits |
| `EP011_KIT_PUBLICATION.md` | Légende, hashtags, ta question à épingler, accroches, extraits |
| `EP011_AUDIO.wav` | Mixage final |

## 2. Le texte adapté au ton de prof

Ton script est conservé en entier au début de `EP011_SCRIPT.txt`. La narration le réécrit **sans rien retirer ni ajouter sur le fond**, avec les procédés de la vidéo de référence :
- **le tutoiement :** « Imagine : il est trois heures du matin », « Tu te sens compris » ;
- **des balises de prof :** « Alors, posons-nous une question simple », « Pour y voir clair, il faut parler de Martin Buber », « Retenons ça : un objet… ou une présence », « Sauf que… », « Et la science, qu'est-ce qu'elle en dit ? », « Résultat : … », « Mais attention : … » ;
- **des phrases courtes et des exemples concrets ;**
- **à la fin,** ta question, puis « Dis-moi ce que tu en penses en commentaire ».

Les faits suivent mot pour mot les sources (voir les références) :
- l'étude a suivi **plus de 2 000 adultes, dans quatre pays, pendant un an** ;
- le résultat porte sur l'**isolement émotionnel** ;
- les analyses sont **exploratoires**.

## 3. La voix (nouveau ton)

**Les groupes de souffle :** les 30 groupes de 5 à 14 mots sont générés chacun seul, avec l'intention `explique` (émotion 0,98), suivis d'une petite pause de 0,2 à 0,6 s. Les questions sont plus posées (`explique_q`).

**Mesures, comparées à la vidéo de référence :**

| Mesure | EasyMath (référence) | EP010 (ancien ton) | **EP011** |
|---|---|---|---|
| Pauses de 0,25 s ou plus | 18 à 19 par minute | 12 par minute | **19 par minute** ✅ |
| Mots entre deux respirations | 11 à 13 | 15 | **12** ✅ |
| Débit | 4,3 à 5,5 syllabes/s | 4,9 | **5,2** ✅ |
| Mélodie de la voix (étendue) | 14 à 19 demi-tons | 8,3 | **8,8** (pas encore atteint) |
| Contraste fort / doux | 12 dB | 8 dB | **8,8 dB** (pas encore atteint) |

- **Atteint :** le rythme, les pauses et les phrases courtes de la référence.
- **À moitié atteint :** la mélodie et le contraste. L'essai fait sur l'épisode 10 montait bien plus haut, mais le traitement de la voix (mastering et compression du mixage) aplatit une partie de l'expression.
- **Pour l'épisode 12 :** monter l'émotion à 1,1 et alléger la compression sur ce ton, ou agrandir légèrement la mélodie après coup (analyse/resynthèse WORLD, déjà utilisée pour les montées des questions). Ton avis à l'écoute décidera.

**Les questions montent :**
- « …être aimé ? » : +5 demi-tons ajoutés ;
- « …qu'elle en dit ? » : +5 ;
- « …rencontrer vraiment l'autre ? » : +1,8 naturel, plus 2,7 ajoutés.

**Contrôles de la voix :**
- **Prononciations testées avant la production :**
  - « Buber » était lu « Bubé » ; la graphie phonétique « Boubère » est retenue ;
  - « chatbots » est passé tel quel au premier essai, puis il a fallu « tchatbots » (voir plus bas).
- **Prises écartées automatiquement :** une vingtaine, parce qu'elles avaient des sons parasites après le dernier mot. C'est l'effet du nouveau contrôle de fin de prise.
- **Cinq groupes refaits** avec le nouvel outil de reprise ciblée (`motion/tools/retake.py`), qui ne garde que les prises où les mots-clés sont entendus par les deux modèles, avec et sans bruit de fond, sans mot en trop :

  | Groupe | Problème corrigé |
  |---|---|
  | « chatbots » | lu « chats beaux » → graphie « tchatbots » |
  | « une réponse empathique » | entendu « dépense » |
  | « qu'est-ce qu'elle en dit ? » | entendu « que l'on dit » |
  | « …qui ne te contredit jamais » | une syllabe parasite après « jamais » |
  | « le rapport Je-Cela » | un « cela » répété |

## 4. Le modèle « tableau vivant »

| # | Temps | Ce qu'on voit |
|---|---|---|
| 01 | **L’accroche** | dès la première image : L’ÉNIGME DU JOUR · UNE MACHINE PEUT-ELLE T’AIMER ? (le logo s’allume, signature sonore) · une horloge « 3 h du matin » |
| 02 | **La confidence** | les mots de la voix apparaissent un à un, « blessures… » et « intelligence artificielle » surlignés · un téléphone et une bulle de discussion |
| 03 | **Ce que fait l’ia** | un petit robot ; quatre cartes qui se cochent : Elle ne s’impatiente jamais · Elle t’écoute · Elle reformule tes peurs · Elle trouve les mots |
| 04 | **Tu te sens compris** | la phrase mot à mot, « compris. » en rose · un cœur au trait |
| 05 | **La question** | « Posons-nous une question simple. » · Être compris… est-ce que c’est être aimé ? (mot à mot, « aimé ? » en rose) |
| 06 | **Martin buber** | Pour y voir clair… · MARTIN BUBER · 1878 – 1965 · Je et Tu (1923) · deux personnes reliées |
| 07 | **Je-cela / je-tu** | DEUX MANIÈRES D’ÊTRE EN RELATION · carte JE – CELA (un cube : l’autre devient un objet) · carte JE – TU (deux personnes reliées : tu accueilles une présence) |
| 08 | **Retenons ça** | Retenons ça. · UN OBJET · ou · UNE PRÉSENCE |
| 09 | **Les signes du réconfort** | la phrase mot à mot, « signes » surligné · une bulle et un cœur |
| 10 | **Sauf que…** | « Sauf que… » · une réponse empathique ne prouve pas, à elle seule, qu’une expérience émotionnelle existe derrière elle (« ne prouve pas » surligné) · le petit robot |
| 11 | **Et la science ?** | carte PSYCHOLOGICAL SCIENCE · 2026 · Folk & Dunn · + de 2 000 adultes · 4 pays · 12 mois · un groupe de personnes |
| 12 | **Le résultat** | Résultat · chatbots de compagnie ↑ → isolement émotionnel ↑ |
| 13 | **La prudence** | un panneau « attention » · Les chercheurs restent prudents · analyses encore exploratoires |
| 14 | **Le danger** | la phrase mot à mot, « pas » surligné · une bulle |
| 15 | **Préférer…** | Le danger : finir par préférer… · carte « une présence qui ne te contredit jamais » (un miroir) · carte « une personne qui a sa propre liberté » |
| 16 | **La question finale** | mot à mot, « comprendre… » surligné, « l’autre ? » en rose |
| 17 | **Ta réponse** | une bulle de commentaire · Dis-moi ce que tu en penses en commentaire. · puis le CARTON DE FIN : le logo s’allume (signature sonore) · L’Énigme humaine · FAIS TA PROPRE RÉFLEXION · Suis la série / une nouvelle question chaque semaine |

**Ce qui est constant d'un épisode à l'autre :**
- le fond papier ;
- les mots qui apparaissent avec un rebond à l'instant où ils sont prononcés ;
- le surligneur jaune et le rose pour les mots-clés ;
- les pictogrammes au trait ;
- les cartes ;
- les enchaînements secs (0,28 s) ;
- la barre de progression rose ;
- le logo, la signature sonore et le carton de fin.

Le travail propre à chaque épisode se limite désormais à la liste des temps dans `scene.js`.

## 5. Musique
- **Une seule musique de fond, continue et plus rythmée :** pulsation à chaque temps et charleston en contretemps, en **la mineur à 96 battements/min**, avec un arpège de piano.
- Elle rejoint le thème de fin de la série en ré majeur (sol, la, ré).
- **Design sonore :** un petit « tic » clair sur chaque mot surligné et un souffle court à chaque enchaînement.

## 6. Contrôles

| Vérification | Résultat |
|---|---|
| Durée | ✅ 106,1 s (1 min 46). Plus long que d'habitude : c'est l'effet du ton « explication de prof » et de l'appel à commenter |
| Décodage intégral | ✅ Sans erreur |
| Transcription du master, modèle « medium » | ✅ **0,7 % d'écart** : seulement « Boubert », l'orthographe de la prononciation voulue, et une élision « qu' » |
| Transcription du master, modèle « small » | 6,0 % d'écart brut (nombres en chiffres, homophones) |
| Niveaux | ✅ Parole -10,5 dBFS, musique seule -14,4 dBFS (baissée de 2 dB : la pulsation est plus marquée), crête -0,5 dBFS |
| Temps de rendu des images | ✅ **2 min 36**, contre 5 à 7 min avec les décors : le modèle simplifie bien le travail |
| Sources | ✅ Buber (SEP 2026), Folk et Dunn 2026 (Crossref, résumé), Li et coll. 2026 et Masterson et coll. 2026 (Crossref) |
| Droits des images | ✅ Aucun portrait ni aucune image tierce : texte et pictogrammes dessinés par code |

## 7. Limites
- Je ne peux ni écouter ni regarder le résultat en continu : **un visionnage complet avec le son reste nécessaire avant publication**, surtout pour juger le nouveau ton et le nouveau style.
- Les études de Li et collègues et de Masterson et collègues ont été vérifiées par leur fiche bibliographique (Crossref) seulement : ScienceDirect n'est pas accessible d'ici. Elles ne sont pas citées à l'écran.
