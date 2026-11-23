# Voix C, version homme (23/11/2026)

Deux timbres masculins **synthétiques**, qui n'imitent personne de réel. Ils sont fabriqués à partir de la référence de la voix C de la série (`../voix_reference.flac`) :
- la hauteur est abaissée (de 204 Hz à environ 120 Hz) ;
- les formants sont descendus (analyse/resynthèse WORLD) ;
- outil : `motion/tools/male_ref.py`.

| Fichier | Contenu |
|---|---|
| `Voix_homme_A_demo.mp3` | Démo, timbre **A** (plus clair, environ 135 Hz) : début de l'épisode 008 |
| `Voix_homme_B_demo.mp3` | Démo, timbre **B** (plus grave, environ 120 Hz) : même texte |
| `Voix_homme_A_reference.wav` / `Voix_homme_B_reference.wav` | Références de timbre de 16 s, à donner au moteur Chatterbox pour obtenir la même voix |

## Générer toi-même, gratuitement

Utilise la démo officielle de Chatterbox Multilingual (le moteur de la voix C, licence MIT, usage commercial autorisé) :
https://huggingface.co/spaces/ResembleAI/Chatterbox-Multilingual-TTS

1. Choisis la langue **French**.
2. Colle ton texte.
3. Dans la zone de l'audio de référence, importe `Voix_homme_A_reference.wav` ou `Voix_homme_B_reference.wav`.
4. Règle les deux curseurs :
   - **Exaggeration** : environ 0,8, plus haut pour plus d'expression ;
   - **CFG / Pace** : environ 0,3 à 0,4, plus bas pour un rythme plus posé.
5. Lance la génération, puis télécharge le fichier audio avec l'icône de téléchargement du lecteur.

Conseils :
- Génère les textes longs par passages de deux ou trois phrases.
- Fais plusieurs essais par passage et garde le meilleur. C'est ce que fait la série, avec trois à six prises par passage.

## Droits
- **Chatterbox Multilingual :** licence MIT.
- **Filigrane :** le moteur ajoute un filigrane inaudible (« Perth ») qui signale un contenu de synthèse.
- **Timbre de départ :** il vient de Kokoro-82M (voix `ff_siwis`, Apache-2.0 selon la fiche du modèle). La licence du corpus SIWIS est annoncée comme CC BY 4.0 mais n'a pas été confirmée sur la source d'origine : à vérifier avant une campagne publicitaire payante.
