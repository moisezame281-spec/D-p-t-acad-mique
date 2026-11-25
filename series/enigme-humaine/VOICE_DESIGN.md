# L'Énigme humaine : direction de la voix off (voice design)

> **Nouveau ton, du 25/11/2026 (pour l'EP011) : « explication de prof ».** Il est calqué sur la vidéo de référence choisie par le producteur (EasyMath, « l'hypothèse de Riemann », TikTok, 9 min). Le timbre reste la voix B de la série : **on reproduit le ton, jamais la voix d'un créateur.**
>
> **Mesures de la référence comparées à notre voix (EP010) :**
>
> | Mesure | Référence | EP010 | Cible |
> |---|---|---|---|
> | Mélodie de la voix (étendue, 10 à 90 %) | 14 à 19 demi-tons | 8 demi-tons | **14 demi-tons ou plus** |
> | Contraste fort / doux (90/10 %) | 12 dB | 8 dB | **12 dB ou plus** |
> | Pauses de 0,25 s ou plus | 18 à 19 par minute, médiane 0,4 s | 12 par minute | **16 à 20 par minute, 0,25 à 0,45 s** |
> | Mots entre deux respirations (médiane) | 11 à 13 | 15 | **5 à 14** |
> | Débit pendant la parole | 4,3 à 5,5 syllabes/s | 4,9 | **4,5 à 5,4** (questions vers 4,5) |
>
> **Diction :**
> - Chaque groupe de souffle est généré seul avec l'intention `explique` (émotion 1,05, débit 0,45), puis suivi d'une petite pause.
> - Les questions utilisent `explique_q` (débit 0,36, cinq prises), et leur réponse arrive juste après.
> - Il ne faut jamais de morceau de moins de 4 à 5 mots : le moteur y répète des fins de mot.
> - Essai sur le passage Derrida de l'EP010 : on passe de 8 à 22 demi-tons d'étendue, de 9 à 15 dB de contraste et de 0 à 14 pauses par minute.
>
> **Écriture (si le producteur le demande) :**
> - Le tutoiement (« écoute bien », « réfléchis deux secondes »).
> - Des phrases courtes.
> - Des balises de prof : « Pour comprendre, il faut… », « Posons-nous une question simple », « Retenons ça », « C'est là que ça devient intéressant », « Sauf que… ».
> - Une question suivie immédiatement de sa réponse, des exemples concrets et un petit récapitulatif.
> - À la fin, une question et une invitation à commenter (« Dis-moi ce que tu en penses en commentaire »).
> - Les faits, les références et les questions du producteur sont toujours conservés.

> **Choix du 23/11/2026 : voix C en version homme, timbre B (grave), à partir de l'épisode 009.** Même moteur (Chatterbox), même jeu, même méthode. Seule la référence de timbre change : `series/enigme-humaine/voix_homme/Voix_homme_B_reference.wav` (timbre synthétique, voir `voix_homme/LISEZMOI.md`). Dans `narration.json` : `"ref": "../../../series/enigme-humaine/voix_homme/Voix_homme_B_reference.wav"`. Les épisodes 001 à 008 restent en voix C féminine.

> **Mise à jour du 22/11/2026 (retour sur l'ép. 004) : explication CONTINUE.** Chaque passage (une scène) est généré **d'un seul tenant** (`"group"` dans `narration.json`), sans silence entre les phrases. Cela supprime les micro-bégaiements aux coupes et rend le ton d'une vraie explication. Les questions doivent **monter** : la meilleure prise est choisie aussi sur la montée finale, et s'il manque de la hauteur, elle est ajoutée seulement sur le mot concerné (`"question_rise"`, `"rise_words"` ; analyse/resynthèse WORLD). Les prises sont jugées par Whisper « medium » (`"judge": "medium"`), et toute répétition ou bégaiement élimine la prise.

> **Choix validé le 21/11/2026 : version C, expressive.** Elle est le standard de la série à partir de l'épisode 002. Ton : un professeur qui explique sa logique à un élève, avec chaleur, en posant les choses et en marquant les mots clés.

La voix porte l'épisode. Ce document fixe la méthode pour qu'elle soit **expressive, crédible et constante** d'un épisode à l'autre.

## 1. Le moteur : même voix, plus de jeu

| Version | Moteur | Mélodie mesurée* | Ressemblance avec la voix validée** | Fidélité au texte |
|---|---|---|---|---|
| A, actuelle | Kokoro `ff_siwis` | 8,6 à 10,6 demi-tons | référence | 100 % |
| B, dirigée | Kokoro, silences et débit dirigés, traitement studio | environ 11 demi-tons | 0,89 | quasi parfaite |
| C, expressive | **Chatterbox** (licence MIT), avec la voix validée comme référence de timbre, réglage d'émotion à 0,8 | **jusqu'à 17,7 demi-tons** | 0,89 | 95 à 100 % |

\* Écart entre les notes graves et aiguës de la phrase. Plus il est grand, moins la voix sonne « robot ».
\** La version B, qui est exactement la même voix avec un traitement studio, obtient déjà 0,89. La version C conserve donc la même identité vocale.

## 2. La feuille de direction (une ligne par phrase)

Chaque phrase reçoit une **intention** :

| Intention | Usage | Débit | Émotion (C) | Silence après |
|---|---|---|---|---|
| **flow** *(standard depuis le 22/11)* | passages entiers, explication continue | naturel (0,40) | 0,80 | 0,2 s entre deux passages seulement |
| **flow_slow** *(ouverture, depuis l'ép. 007)* | les toutes premières phrases | plus posé (0,30) | 0,78 | idem, avec une cible de débit (`pace`) |
| **intime** | ouverture, question finale | posé (rythme 0,33) | 0,78 | 0,7–1,0 s |
| **grave** | la question centrale, la nuance | très posé (0,30) | 0,85 | 1,0 s (avec coupure de la musique) |
| **prof** *(par défaut)* | les explications, la logique d'une tradition | posé et clair (0,38) | 0,72 | 0,4–0,8 s |
| **récit** | les références (sourate, verset, livre) | naturel (0,42) | 0,62 | 0,2–0,5 s |
| **élan** | la bascule (« Et Albert Camus ? », « Mais voici… ») | plus vif (0,45) | 0,80 | 0,5 s |

*Réglage dans `narration.json` : `"engine": "chatterbox"`, `"ref": "…/voix_reference.flac"` (le timbre de la voix validée), et `"intent"` sur chaque phrase.*

**Règles d'écriture pour la voix**
1. Une respiration ne dépasse pas 14 mots. Au-delà, couper par une virgule ou un silence.
2. Un seul mot fort par phrase, placé **en fin de phrase**, là où la voix retombe et marque.
3. Toujours un silence réel après une question (0,8 à 1 s), et la musique se retire juste avant.
4. Les points de suspension (…) créent une suspension naturelle chez les deux moteurs.
5. Les chiffres sont écrits en toutes lettres pour la synthèse (« verset cent cinquante-cinq »).
6. Chaque phrase est générée en plusieurs prises. La transcription élimine celles qui écorchent le texte, puis on garde la plus expressive.
7. *(depuis l'ép. 003)* **Queues parasites :** si le moteur ajoute des syllabes après le dernier mot (« … une question, six litres »), elles sont détectées par la transcription et coupées automatiquement (`narrate.py`).
8. *(depuis l'ép. 003)* **Références et nombres :** une prise n'est retenue que si deux modèles de transcription (Whisper « small » et « medium ») entendent le bon nombre. Pour les livres bibliques, on écrit la lecture complète, par exemple « la première lettre aux Thessaloniciens, chapitre cinq, verset vingt et un ».
9. *(depuis l'ép. 004)* **Noms propres piégeux :** on teste une graphie phonétique et on la valide avec deux modèles de transcription (« Kant » → « Kante », sinon la voix dit « quand »). Le texte affiché reste celui du script.
10. *(depuis l'ép. 004)* **Répétitions cachées :** toute la voix est relue par le modèle « medium ». Une répétition du moteur (« l'autre non… l'autre non ») se corrige avec `"trim_end"` (fin de prise imposée, en secondes) dans `narration.json`.
11. *(depuis l'ép. 007)* **Une ouverture plus posée** (demande du 22/11) : les premières phrases utilisent l'intention `flow_slow` (même ton, rythme un peu plus lent) avec une cible de débit (`"pace"`, en mots par seconde). Parmi les prises correctes, on préfère la plus posée. Si la question d'ouverture reste trop rapide, `motion/tools/stretch.py` la ralentit d'environ 10 % par étirement temporel, sans changer la hauteur de la voix, et met le minutage à jour. Objectif : environ 5 syllabes par seconde sur l'ouverture, contre 5,4 à 5,8 sur le reste.
12. *(depuis l'ép. 008)* **Les questions aussi sont posées** (demande du 23/11) : toute question (ouverture, question centrale, question finale) a le même rythme que l'ouverture. Elle est générée seule avec `flow_slow`, une cible de débit (`pace`) et un débit maximal (`"max_syl": 5.0`). Si la prise dépasse ce débit, `narrate.py` l'étire automatiquement (jamais plus de 15 %), puis vérifie qu'elle monte toujours.

## 3. Le traitement studio (`motion/tools/voice_master.py`)

La chaîne est la suivante : coupe-bas (75 Hz), puis **chaleur** (effet de proximité), puis **présence** (2,8–5,2 kHz), puis dé-esseur, puis compression 3:1, puis densité légère, puis petite pièce (0,35 s). En mode « intime », il y a plus de chaleur et moins de réverbération : la voix semble chuchotée à l'oreille.

## 4. Le mixage

- La voix est toujours devant : environ -10,5 dBFS pendant la parole, et la musique baisse d'environ 8 dB sous la voix.
- Coupure totale de la musique sur la question centrale, et voix presque seule sur la question finale.
- Silence réel sur la dernière demi-seconde.

## 5. Pour aller encore plus loin (en option)

- **Une voix humaine professionnelle** (comédien ou comédienne) : c'est le plus haut niveau. Le texte minuté est déjà prêt.
- **Un service de synthèse vocale premium** (par exemple ElevenLabs) : il faut un compte et une clé d'accès. Les deux s'intègrent au même pipeline sans rien changer au reste.
