# EP007 : rapport de production

**L'Énigme humaine, épisode 007 : « Es-tu encore la même personne ? »**

Produit le 22/11/2026 dans le **style validé**, avec un ajout demandé (le début un peu plus lent) :
- explication continue (voix C, chaque scène dite d'un seul tenant) ;
- questions qui montent ;
- une seule musique de fond, continue ;
- fondus enchaînés en mouvement ;
- des décors nouveaux ;
- **nouveau :** une ouverture un peu plus posée.

## 1. Livrables

| Fichier | Contenu |
|---|---|
| `EP007_MASTER_9x16.mp4` | 1080×1920, 30 i/s, H.264, AAC 48 kHz, **67,4 s** |
| `EP007_TIKTOK.mp4` / `EP007_YOUTUBE_SHORTS.mp4` | Identiques au master |
| `EP007_PROMO_15s.mp4` | 16 s : la question d'ouverture (le miroir), puis la question finale entière et le titre |
| `EP007_COVER.png` | Couverture : le miroir ancien où se superposent l'adulte et l'enfant, sous le titre |
| `EP007_SUBTITLES.srt` | Sous-titres minutés au mot près |
| `EP007_SCRIPT.txt` / `EP007_REFERENCES.md` / `EP007_AUDIO_LICENSES.md` | Texte et minutage ; sources vérifiées ; droits |
| `EP007_AUDIO.wav` | Mixage final |

## 2. Un début un peu plus lent (ta demande)

| Passage | Débit EP006 | Débit EP007 |
|---|---|---|
| Ouverture (scène 1) | 5,8 syllabes/s | **5,15 syllabes/s** (environ 12 % plus lent) |
| Question d'ouverture (scène 2) | 5,4 syllabes/s | **5,4 syllabes/s** (ralentie de 10 %, elle était à 6,1) |
| Reste de l'épisode | 5,2 à 5,4 syllabes/s | 5,4 syllabes/s (inchangé) |

**Comment c'est obtenu :**
- **Les deux premières phrases** utilisent une intention plus posée (`flow_slow`). Parmi les prises correctes, la plus lente est retenue.
- **La question d'ouverture** est restée rapide sur toutes les prises. Elle a été ralentie de 10 % par étirement temporel, sans changer la hauteur de la voix (nouvel outil `motion/tools/stretch.py`).

Le ton reste le même : c'est seulement le rythme qui se pose.

## 3. Mise en scène (tous les décors sont nouveaux)

| # | Scène | Ce qu'on voit |
|---|---|---|
| 01 | **La vieille photographie** | Un tirage sépia à bord dentelé sur une table en bois, dans la lumière d'une fenêtre : le portrait d'un enfant. Le tirage de l'adulte glisse à côté. Un cerf-volant (rêves), une étoile (croyances) et un cœur (aimer) partent de l'enfant et arrivent en pointillés chez l'adulte, avec un « ? ». |
| 02 | **La question** *(le miroir ancien)* | Une pièce au papier peint damassé, un grand miroir ovale doré et l'élève de dos. Le reflet de l'adulte devient celui de l'enfant sur « toujours », puis les deux se superposent sur « personne ». La question s'écrit mot à mot. |
| 03 | **John Locke** *(le portrait, puis le fil des souvenirs)* | Le portrait de Locke par Godfrey Kneller (1697, domaine public), avec ses dates et son livre. Puis l'élève tient un fil de lumière où sont accrochés des souvenirs qui s'éloignent vers le passé. Sur « continuité de notre conscience », le fil s'allume. Sur « nous reconnaître », chaque souvenir s'éclaire et l'élève s'y voit. La phrase de Locke (*Essai*, II, 27, § 9) est affichée en traduction libre. |
| 04 | **Neurosciences** *(la mémoire en mosaïque)* | Un réseau de neurones s'allume. Un souvenir d'enfance, sur pellicule, se défait en tuiles sur « fidèle », puis se recompose sur « reconstruit ». Certaines tuiles reviennent changées (porte, arbre, soleil, cerf-volant) et s'entourent de rose sur « modifiant ». La référence à Schacter (2012) est affichée. |
| 05 | **La tradition bouddhiste** *(le lac à l'aube)* | L'élève assis en tailleur sur un rocher, au bord d'un lac, à l'aube. Le corps, les sensations (des ondes), les pensées (des bulles) et la conscience (une lumière intérieure) s'inscrivent autour de lui. Le mot « MOI », en pierre, se défait en poussière sur « immuable ». La citation de SN 22.59 est donnée en traduction libre. Il n'y a aucune figure sacrée. |
| 06 | **La nuance** *(la statue dans la brume)* | Trois marcheurs (Locke, neurosciences, bouddhisme) portent trois lanternes de couleurs différentes. Leurs faisceaux divergent (« ne disent pas la même chose »), puis convergent sur une statue de pierre qui se fissure et perd des éclats (« ébranlent… une identité figée »). Le titre à l'écran se fend lui aussi. |
| 07 | **La question finale** *(la galerie des trois cadres)* | Trois cadres s'éclairent tour à tour : la photographie de l'enfant (« avons été »), le miroir (« sommes »), puis un cadre ouvert sur la lumière où une silhouette se forme (« devenir »). La question s'écrit mot à mot. Titre et thème de fin. |

## 4. Voix et musique

- **Voix C, en continu**, avec 3 à 5 prises par passage, jugées par Whisper « medium » : aucune répétition, aucun bégaiement.
- **« John Locke »** et **« dix-septième »** sont bien prononcés (vérifié par la transcription).
- **Questions :**
  - « … la même personne ? » monte d'environ 7 demi-tons entre « même » et « personne » ;
  - pour la question finale, une montée a été ajoutée sur « été » (+2,5), « sommes » (+2) et « devenir » (+5).
- **Musique de fond unique et continue :** nappe de cordes, basse, arpège de piano et pulsation douce, en **mi mineur à 78 battements/min** (une couleur nostalgique, pour la mémoire).
  - Une **boîte à musique** joue sur la photographie d'enfance et revient sur « la personne que nous avons été ».
  - La musique rejoint le thème de fin en ré majeur, sans aucune coupure.

## 5. Contrôles

| Vérification | Résultat |
|---|---|
| Durée | ✅ 67,4 s |
| Décodage intégral | ✅ Sans erreur |
| Transcription du master, modèle « medium » | ✅ **Aucune erreur réelle.** L'écart de 0,6 % vient d'un « Mais » omis par le modèle sur le fichier entier ; il est bien entendu quand on réécoute ce passage seul. |
| Transcription du master, modèle « small » | ✅ 1,6 % d'écart brut |
| Niveaux | ✅ Parole -10,4 dBFS, musique seule -15,1 dBFS, crête -0,5 dBFS |
| Sources | ✅ Locke (SEP, Gordon-Roth 2025, texte de l'*Essai* II.27.9), Schacter 2012 (Crossref et texte intégral PMC), anattā (SEP, Coseru) et SN 22.59 (pāli et traduction de Bhikkhu Sujato, SuttaCentral) |
| Respect des traditions | ✅ Aucune représentation du Bouddha ni d'objet de culte ; simplification des cinq agrégats signalée dans les références |
| Droits des images | ✅ Seul le portrait de Locke est une image tierce, dans le domaine public (crédit à l'écran) |

## 6. Environnement
- Deux sites ont été ajoutés aux sites autorisés de ton environnement pour vérifier tes références : **pmc.ncbi.nlm.nih.gov** (Schacter) et **suttacentral.net** (SN 22.59).

## 7. Limites
- Je ne peux ni écouter ni regarder le résultat en continu : **un visionnage complet avec le son reste nécessaire avant publication.**
- Le ralentissement de la question d'ouverture est un étirement temporel de 10 %. Il est discret, mais si tu entends le moindre effet « traîné », je peux le ramener à 5 %.

## 8. Publication (proposition)

**Accroche :** ES-TU ENCORE LA MÊME PERSONNE ?
**Description :** Une photo d'enfant, un visage familier… mais est-ce encore toi ? Locke, les neurosciences et la tradition bouddhiste ébranlent l'idée d'une identité figée. Alors, à qui dois-tu être fidèle : à celui que tu as été, à celui que tu es, ou à celui que tu peux encore devenir ?
**Mots-clés :** #philosophie #identité #Locke #mémoire #bouddhisme #bac #philo #LÉnigmeHumaine
