import { CourseDay } from '../types';

export const courseDays: CourseDay[] = [
  // --- PHASE 1: DÉBUTANT (JOURS 1-7) ---
  {
    id: 1,
    phase: 'Débutant',
    title: 'Installation et Bases',
    description: 'Installez votre environnement de développement et écrivez vos premières instructions en Python.',
    topics: [
      'Historique et Philosophie de Python',
      'Le modèle d\'exécution : Compilation vs Interprétation',
      'Installation de l\'interpréteur Python et de VS Code',
      'Premier programme et flux d\'E/S : print() et input()',
      'Variables, Étiquettes mémoire et Types primitifs',
      'Opérateurs arithmétiques fondamentaux et nuances mathématiques'
    ],
    contentMarkdown: `### 1. Qu'est-ce que Python ? Définition & Caractéristiques
Python est un langage de programmation **de haut niveau**, **interprété**, **multiparadigme** et **typé dynamiquement**. Conçu pour privilégier la lisibilité du code historique, sa philosophie est résumée par le *Zen de Python* (accessible en tapant \`import this\` dans un interpréteur) : « *Beautiful is better than ugly. Explicit is better than implicit. Simple is better than complex.* ».

Ses atouts fondamentaux sont :
- **Syntaxe épurée** : L'utilisation de l'indentation obligatoire à la place des accolades (\`{}\`) ou des mots-clés de fin de bloc (\`end\`).
- **Productivité exceptionnelle** : Moins de lignes de code qu'en C++ ou Java pour un résultat équivalent.
- **Écosystème gigantesque** : Connu pour sa philosophie « *Batteries included* », sa bibliothèque standard couvre de très nombreux besoins.

---

### 2. Aperçu Historique & Créateur
Python a été conçu au tout début de l'année 1989 par le développeur hollandais **Guido van Rossum** au *Centrum voor Wiskunde en Informatica* (CWI) aux Pays-Bas. Il cherchait un successeur au langage ABC qui permettrait aux administrateurs système d'écrire des scripts hautement structurés. La première version publique (0.9.0) sort en février **1991**.

**L'anecdote sur le nom** : Contrairement aux apparences, le nom « Python » n'a absolument rien à voir avec le reptile. Guido van Rossum a choisi ce terme en référence aux célèbres comédiens britanniques de la série télévisée satirique **Monty Python's Flying Circus**, dont il était un fan inconditionnel.

La chronologie d'évolution du langage s'articule autour de trois pivots majeurs :
- **Python 1.0** (1994) : Présente les fonctions d'ordre supérieur du paradigme fonctionnel (\`lambda\`, \`map\`, \`filter\`, \`reduce\`).
- **Python 2.0** (2000) : Introduit les listes en compréhension, le ramasse-miettes (*Garbage Collector*) et le support d'Unicode.
- **Python 3.0** (2008) : Une révision majeure brisant la rétrocompatibilité historique afin de nettoyer les duplications de syntaxe (par exemple, \`print\` devient une fonction stricte au lieu d'une instruction). C'est pourquoi le code écrit pour Python 2 n'est plus compatible nativement avec Python 3.

---

### 3. Le Processus d'Exécution : Compilation vs Interprétation
Il est fréquent de classer grossièrement Python comme un langage « interprété ». En réalité, le modèle d'exécution de Python est **hybride** :
1. **Compilation intermédiaire** : Lorsque vous lancez un fichier \`.py\`, l'interpréteur vérifie d'abord que le code est syntaxiquement correct, puis le compile de manière transparente en un format binaire intermédiaire de bas niveau appelé **Bytecode** (générant des fichiers \`.pyc\` dans des dossiers \`__pycache__\`).
2. **Interprétation de la machine virtuelle** : Ce bytecode (instructions machine simplifiées) est ensuite envoyé à la Machine Virtuelle Python (**PVM**). La PVM lit, valide et exécute ce bytecode ligne par ligne en le traduisant en instructions binaires que votre processeur physique va exécuter.

L'implémentation standard par défaut s'appelle **CPython** (parce que l'interpréteur officiel et sa machine virtuelle sont programmés en langage C). Il existe d'autres compilateurs alternatifs comme *Jython* (sur JVM), *IronPython* (sur .NET) ou *PyPy* (avec compilateur JIT pour des performances décuplées).

---

### 4. Directives d'Installation de l'Environnement de Travail
Pour débuter sereinement, installez l'interpréteur officiel et un éditeur adapté à vos besoins locaux :

#### A. Installation de Python 3.x
- **Sous Windows** : Téléchargez l'installateur exécutable sur [python.org](https://www.python.org/). **ATTENTION** : Lors de l'installation, veillez à cocher absolument la case **« Add python.exe to PATH »** au bas de l'assistant de démarrage. Sans cette étape, votre console de commande ne pourra pas identifier la localisation de l'exécutable Python.
- **Sous macOS** : Mac est fourni avec une version périmée de Python 2. Il est fortement recommandé d'utiliser l'assistant de python.org ou d'installer une version à jour à l'aide d'Homebrew via le terminal : \`brew install python\`.
- **Sous Linux (Ubuntu/Debian)** : Python 3 est généralement préinstallé. Mettez-le à jour ou installez-le avec :
  \`\`\`bash
  sudo apt-get update && sudo apt-get install python3 python3-pip
  \`\`\`

#### B. Installation et Configuration de VS Code
L'éditeur le plus plébiscité par les ingénieurs est **Visual Studio Code** :
1. Téléchargez VS Code sur [code.visualstudio.com](https://code.visualstudio.com/).
2. Ouvrez le volet des Extensions (\`Ctrl+Shift+X\` ou \`Cmd+Shift+X\`).
3. Installez l'extension officielle **Python** par Microsoft. Celle-ci intègre par défaut **Pylance** (pour l'analyse de type exhaustive, l'autocomplétion intelligente et la documentation intégrée en temps réel).

---

### 5. Premier Programme et Flux d'Entrée / Sortie (E/S)
La base de la programmation réside dans la manipulation des données d'entrée provenant de l'utilisateur, leur traitement intellectuel, puis l'affichage du résultat vers la console.

#### A. Afficher des valeurs avec \`print()\`
La fonction \`print()\` évalue les arguments transmis et affiche leur représentation textuelle :
\`\`\`python
print("Hello,", "monde !", sep="---", end="\\n\\n")
\`\`\`
- Pour afficher des variables facilement sans concaténations pénibles, préférez les **f-strings** (chaînes formatées) arrivées avec Python 3.6 :
  \`\`\`python
  nom = "Guido"
  print(f"Créateur : {nom}")
  \`\`\`

#### B. Saisir des valeurs avec \`input()\`
La fonction \`input(message)\` affiche le message descriptif à l'écran, bloque momentanément l'exécution du script, attend que l'utilisateur rédige sa ligne d'entrée dans le console et appuie sur Entrée, et renvoie **systématiquement** cette saisie sous la forme d'une chaîne de caractères (\`str\`) :
\`\`\`python
# ATTENTION : input() renvoie TOUJOURS un type "str" (texte) !
reponse = input("Saisissez un nombre entier : ")
nombre = int(reponse)  # Conversion de type explicitement requise avant addition numérique
\`\`\`

---

### 6. Variables, Références Mémoire et Types Primitifs Dynamiques
En programmation classique (comme en C++), une variable est similaire à une boîte physique réservée en mémoire dont la capacité ne dépend que du type déclaré.

En Python, la variable est en réalité une **étiquette nominative (une référence)** collée sur un objet dynamique existant quelque part en mémoire :
\`\`\`python
a = [1, 2, 3]  # L'étiquette 'a' pointe vers la liste créée en mémoire
b = a          # L'étiquette 'b' est collée au tout même objet mémoire que 'a'
\`\`\`

#### Les Quatre Piliers des Types Primitifs Fondamentaux
Python utilise le **typage dynamique fort** : les variables reçoivent leur type à la volée selon l'évaluation de la valeur affectée (pas de déclaration préalable), mais le typage reste fort : aucune opération mathématique n'est autorisée entre des types incompatibles d'office.

1. **Entiers (\`int\`)** : Représentent les entiers positifs et négatifs sans limite de taille en Python 3 (précision arbitraire).
   \`\`\`python
   credits = 42
   grand_nombre = 10**100  # Géré sans risque de dépassement de registre (overflow)
   \`\`\`
2. **Décimaux (\`float\`)** : Chiffres à virgule flottante double précision sur 64 bits (norme matérielle **IEEE 754**). En raison de la représentation binaire par puissances inverses de 2, certaines valeurs décimales ne se représentent pas tout à fait de façon exacte.
   \`\`\`python
   fraction = 0.1 + 0.2  # Résultat réel : 0.30000000000000004 !
   \`\`\`
3. **Chaînes de caractères (\`str\`)** : Séquences immuables stockant du texte encodé en **Unicode**.
   \`\`\`python
   pays = 'France'
   multiligne = """Ceci est une longue chaîne
contenant des sauts de ligne réels."""
   \`\`\`
4. **Booléens (\`bool\`)** : Représentent les concepts de logique binaire d'algèbre booléenne, évaluant exclusivement à \`True\` (Vrai) ou \`False\` (Faux).
   \`\`\`python
   est_pythonien = True
   \`\`\`

---

### 7. Les Opérateurs Arithmétiques fondamentaux
Ces symboles permettent de formuler des calculs mathématiques :

- **\`+\` (Addition)** : Additionne deux nombres ou réalise des concaténations de textes.
- **\`-\` (Soustraction)** : Calcule la différence.
- **\`*\` (Multiplication)** : Multiplie deux nombres ou duplique des chaînes (\`"A" * 3\` donne \`"AAA"\`).
- **\`/\` (Division classique)** : Réalise la division mathématique réelle et renvoie **systématiquement** un flottant (\`float\`), y compris si l'opération tombe pile-poil sur un entier (\`10 / 2\` vaut \`5.0\`).
- **\`//\` (Division entière)** : Effectue la division entière et applique la fonction mathématique d'arrondi inférieur (*floor*).
  \`\`\`python
  7 // 2   # Renvoie 3
  -7 // 2  # Renvoie -4 (arrondi vers le bas par rapport à -3.5)
  \`\`\`
- **\`%\` (Modulo)** : Récupère le reste résiduel de la division entière. Très utile pour évaluer la parité (un entier \`n\` est pair si \`n % 2 == 0\`).
- **\`**\` (Puissance)** : Calcule la puissance d'un nombre (ex : \`2 ** 10\` calcule $2^{10}$ soit \`1024\`).`,
    codeExample: `# Illustration exhaustive des acquis du Jour 1
# Déclaration de variables typées dynamiquement
prenom = "Apprenti"
version_python = 3.12
duree_formation = 28  # int

# Calculs mathématiques avancés
puissance_calcul = 2 ** 10
division_reelle = 7 / 2
division_entiere = 7 // 2
reste_division = 7 % 2

# Affichage formaté à l'aide des f-strings
print(f"Bonjour {prenom} !")
print(f"Langage étudié : Python v{version_python}")
print(f"Calculs de référence sur 7 et 2 :")
print(f" - Division réelle : {division_reelle}")
print(f" - Division entière : {division_entiere}")
print(f" - Reste restant (Modulo) : {reste_division}")
print(f" - 2 à la puissance 10 vaut : {puissance_calcul}")`,
    expectedOutput: `Bonjour Apprenti !
Langage étudié : Python v3.12
Calculs de référence sur 7 et 2 :
 - Division réelle : 3.5
 - Division entière : 3
 - Reste restant (Modulo) : 1
 - 2 à la puissance 10 vaut : 1024`
  },
  {
    id: 2,
    phase: 'Débutant',
    title: 'Conditions et Logique',
    description: 'Apprenez à orienter l’exécution de votre programme en fonction de règles logiques complexes.',
    topics: [
      'Opérateurs de comparaison (==, !=, <, >, <=, >=)',
      'Conditions: if, elif, else',
      'Opérateurs logiques: and, or, not',
      'Pratique: Contrôle d’accès, validation de saisie'
    ],
    contentMarkdown: `### 1. Introduction à la Prise de Décision : Pourquoi le code doit-il choisir ?
Un programme qui exécute toujours les mêmes instructions du début à la fin se comporte comme une simple machine à calculer linéaire. La force de l’informatique moderne repose sur sa capacité à s’adapter : **analyser des données, évaluer une situation et décider quelles instructions exécuter ou ignorer.**

Ce mécanisme décisionnel repose sur deux piliers indissociables :
- Les **conditions** (des questions posées au système qui aboutissent à oui ou non).
- L'**indentation** (la structure visuelle par décalage qui indique à Python la conséquence de chaque choix).

---

### 2. Les Booléens : Les Atomes de la Logique (\`True\` et \`False\`)
Avant de poser des questions, il faut comprendre la réponse. En Python, une question logique renvoie systématiquement une valeur d'un type spécial nommé **\`bool\`** (Booléen), baptisé en l'honneur du mathématicien George Boole.

Un booléen ne peut prendre que deux états possibles :
1. **\`True\`** (Vrai, équivalent à un signal électrique activé ou $1$).
2. **\`False\`** (Faux, équivalent à l'absence de signal ou $0$).

> **Attention à la casse !** En Python, la première lettre est obligatoirement en majuscule : écrire \`true\` ou \`false\` provoquera une erreur de syntaxe (\`NameError\`).

---

### 3. Les Opérateurs De Comparaison : Poser des questions à Python
Pour générer des booléens, on compare des expressions ou des variables à l'aide d'opérateurs mathématiques :

| Opérateur | Signification | Exemple | Évaluation |
| :---: | :--- | :--- | :--- |
| **\`==\`** | **Égal à** | \`5 == 5\` | \`True\` |
| **\`==\`** | **Égal à** | \`3 == 4\` | \`False\` |
| **\`!=\`** | **Différent de** | \`10 != 5\` | \`True\` |
| **\`>\`** | **Strictement supérieur** | \`4 > 9\` | \`False\` |
| **\`<\`** | **Strictement inférieur** | \`3 < 8\` | \`True\` |
| **\`>=\`** | **Supérieur ou égal** | \`18 >= 18\` | \`True\` |
| **\`<=\`** | **Inférieur ou égal** | \`15 <= 12\` | \`False\` |

#### ⚠️ Le piège rouge des débutants : \`=\` vs \`==\`
- Un seul symbole **\`=\`** sert à l'**affectation** (ranger une valeur dans un tiroir mémoire).
  *Exemple : \`age = 18\` (Créer une variable age et lui donner la valeur 18)*
- Le double symbole **\`==\`** sert à la **comparaison d'égalité**.
  *Exemple : \`age == 18\` (Est-ce que la variable age contient la valeur 18 ?)*

---

### 4. La Structure Conditionnelle Fondamentale : \`if\`, \`elif\`, \`else\`

Pour exécuter du code selon le résultat d'une condition, on utilise l'instruction **\`if\`** (Si) :

\`\`\`python
age = 20
if age >= 18:
    print("Félicitations, vous êtes majeur !")
\`\`\`

#### Le secret de l’organisation en Python : L'Indentation !
Contrairement à la majorité des langages du marché (C, C++, Java, JavaScript) qui utilisent des accolades \`{}\` pour encadrer le code conditionnel, Python utilise l’**indentation obligatoire** (généralement **4 espaces** produits par la touche tabulation \`Tab\`).
1. Une ligne initiant un bloc de code se termine obligatoirement par un **double-point (\`:\`)**.
2. Toutes les lignes exécutées en conséquence immédiate de cette condition doivent être décalées de 4 espaces vers la droite.
3. Le retour à l'alignement de départ indique la fin du bloc conditionnel.

#### Compléter l'alternative : \`else\` (Sinon)
Si le test de la condition \`if\` échoue (\`False\`), on peut exécuter un bloc de secours universel grâce à \`else\` :

\`\`\`python
age = 15
if age >= 18:
    print("Accès autorisé.")
else:
    print("Accès refusé. Vous devez être majeur.")
\`\`\`

#### Gérer les scénarios multiples : \`elif\` (Sinon Si)
Lorsque vous avez plus de deux options exclusives, empilez des blocs **\`elif\`** (contraction de *else if*). Python évalue les lignes de haut en bas et s'arrête au tout premier embranchement validé.

\`\`\`python
temperature = 25

if temperature > 30:
    print("Il fait très chaud !")
elif temperature >= 20:
    print("La température est agréable.")
elif temperature >= 10:
    print("C'est un peu frais.")
else:
    print("Il fait froid !")
\`\`\`

---

### 5. Les Opérateurs Logiques : Connecter des règles (\`and\`, \`or\`, \`not\`)

Parfois, une décision requiert la vérification de plusieurs critères cumulatifs ou alternatifs. C'est le rôle des opérateurs logiques logés entre vos expressions :

#### A. L'opérateur \`and\` (ET) : L’exigence absolue
Renvoie \`True\` si et seulement si **toutes** les conditions de part et d'autre sont individuellement vraies. Si l'une d'elles s'avère fausse, l'ensemble est invalidé.
- \`True and True\` → \`True\`
- \`True and False\` → \`False\`
- \`False and False\` → \`False\`

*Exemple :*
\`\`\`python
carte_identite = True
billet_avion = True
if carte_identite and billet_avion:
    print("Bon voyage !")
\`\`\`

#### B. L'opérateur \`or\` (OU) : La souplesse tolérante
Renvoie \`True\` si **au moins l'une** des conditions est vraie. L'ensemble est faux uniquement si aucun critère n'est validé.
- \`True or False\` → \`True\`
- \`False or True\` → \`True\`
- \`False or False\` → \`False\`

*Exemple :*
\`\`\`python
argent_liquide = False
carte_bancaire = True
if argent_liquide or carte_bancaire:
    print("Achat approuvé !")
\`\`\`

#### C. L'opérateur \`not\` (NON) : Le bouton d'inversion
Cet opérateur une-partie (unaire) se place devant un booléen pour inverser son état naturel.
- \`not True\` → \`False\`
- \`not False\` → \`True\`

*Exemple :*
\`\`\`python
est_banni = False
if not est_banni:
    print("Bienvenue sur la plateforme !")
\`\`\`

---

### 6. L'évaluation en Court-circuit (*Short-Circuit*)
Python est un interpréteur intelligent et économe. Lors de l'évaluation logique, il s'interrompt dès que le résultat final devient mathématiquement certain :
- Dans un enchaînement **\`A and B\`** : Si \`A\` s'évalue à \`False\`, Python sait que l'expression globale sera fausse, peu importe la valeur de \`B\`. Il n'évalue même pas \`B\`.
- Dans un enchaînement **\`A or B\`** : Si \`A\` s'évalue à \`True\`, l'ensemble est certain d'être vrai. Python ignore l'évaluation de \`B\`.

---

### 7. Imbrication et Bonnes Pratiques de Lisibilité
Vous pouvez intégrer une structure d'aiguillage conditionnel à l'intérieur d'un autre bloc conditionnel :

\`\`\`python
meteo = "pluie"
parapluie = True

if meteo == "pluie":
    if parapluie:
        print("Je sors me promener sous la pluie.")
    else:
        print("Je reste abrité à l'intérieur.")
\`\`\`

**Recommandation d'expert** : Évitez de dépasser 2 ou 3 niveaux d’imbrication, sous peine de transformer votre code en un plat de spaghettis illisible. Préférerez l'usage intelligent des opérateurs logiques comme \`and\` et \`or\` pour aplanir votre code !`,
    codeExample: `# Système intelligent d'accès et d'attribution de réduction tarifaire
print("--- Vérification d'Éligibilité Cinéma ---")

age = 17
est_etudiant = True
heure_seance = 19  # Format 24h

# 1. Évaluation de la majorité
if age >= 18:
    statut_majorite = "Majeur"
else:
    statut_majorite = "Mineur"

# 2. Tarification dynamique avec conditions logiques multiples
# - Moins de 12 ans : 5.0€
# - Étudiant ou mineur, mais avant 18h : 7.5€
# - Tarif normal (soir ou adulte non étudiant) : 11.5€

if age < 12:
    tarif = 5.0
elif (est_etudiant or age < 18) and heure_seance < 18:
    tarif = 7.5
else:
    tarif = 11.5

print(f"Statut : {statut_majorite}")
print(f"Heure demandée : {heure_seance}h")
print(f"Tarif appliqué : {tarif}€")`,
    expectedOutput: `--- Vérification d'Éligibilité Cinéma ---
Statut : Mineur
Heure demandée : 19h

#### 2. Culture & Concepts Avancés pour l'Enseignant
*Pour répondre avec aplomb aux questions techniques des étudiants curieux :*

- **La "Truthiness" (Évaluation en contexte booléen)** :
  - *Concept* : En Python, toute valeur possède une valeur booléenne implicite. On appelle cela "Truthy" ou "Falsy".
  - *Explication enseignant* : Les valeurs considérées comme **Falsy** sont : \`None\`, \`False\`, le nombre \`0\` (sous toutes ses formes : 0, 0.0), les collections vides (chaînes de caractères \`""\`, listes \`[]\`, dictionnaires \`{}\`). Tout le reste est **Truthy**. Ainsi, au lieu d'écrire \`if len(chaine) > 0:\`, les développeurs Python chevronnés écrivent simplement \`if chaine:\`.
- **L'opérateur d'identité \`is\` vs l'opérateur d'égalité \`==\`** :
  - *Concept* : \`==\` vérifie si les valeurs sont égales. \`is\` vérifie si les deux variables pointent vers le même objet exact en mémoire (vérifie \`id(a) == id(b)\`).
  - *Explication enseignant* : 
    \`\`\`python
    a = [1, 2]
    b = [1, 2]
    print(a == b) # True (valeurs identiques)
    print(a is b) # False (deux listes distinctes en mémoire)
    \`\`\`
    Insistez sur le fait que \`is\` ne doit être utilisé que pour comparer des singletons, typiquement \`None\` (ex: \`if x is None:\`).
- **Le Pattern Matching Structurel (Python 3.10+)** :
  - *Concept* : L'instruction \`match / case\` équivalente au switch/case d'autres langages.
  - *Explication enseignant* : Introduit récemment, il permet non seulement de comparer des valeurs simples, mais aussi de filtrer selon la structure des objets ou des types. C'est une excellente alternative aux longs blocs d'\`elif\`.

---

#### 3. Décryptage de la phrase clé (Dictionnaire Pédagogique)
- **Indentation** : 
  - *Explication* : En Python, l'indentation n'est pas juste là pour faire joli (contrairement à C++ ou JS) ; elle définit les blocs logiques du programme. Une indentation incohérente produit un \`IndentationError\`. Utilisez 4 espaces (recommandé par la PEP 8).
- **Court-circuit logique (Short-circuiting)** :
  - *Explication* : Dans un \`and\`, si le premier membre est faux, l'ensemble est d'office faux, donc le second n'est pas évalué. Dans un \`or\`, si le premier membre est vrai, l'ensemble est certain d'être vrai. Python ignore l'évaluation de B. Cela permet d'écrire des gardes robustes comme : \`if denominateur != 0 and (numerateur / denominateur) > 2:\` sans risquer de division par zéro !
- **Précédence des opérateurs** :
  - *Explication* : L'opérateur \`not\` est prioritaire sur \`and\`, qui est lui-même prioritaire sur \`or\`. Utilisez des parenthèses pour rendre vos intentions de calcul explicites et faciles à lire pour tout le monde.

---

#### 4. Foire Aux Questions (FAQ) Typique
- **Q : "Pourquoi ai-je une erreur \`SyntaxError: cannot assign to expression\` dans ma condition ?"**
  *Réponse :* "Tu as écrit \`if age = 18:\` au lieu de \`if age == 18:\`. Un simple signe égal est réservé pour donner une valeur à une variable, pas pour tester l'égalité."
- **Q : "Est-ce qu'on peut écrire des conditions sur une seule ligne ?"**
  *Réponse :* Oui, grâce à l'opérateur ternaire : \`statut = "Majeur" if age >= 18 else "Mineur"\`. C'est très utile pour des affectations simples et directes.
- **Q : "Quelle est la différence entre \`elif\` et une suite de \`if\` simples ?"**
  *Réponse :* Les \`if\` consécutifs sont évalués de manière totalement indépendante (plusieurs branches de code peuvent être exécutées). Les \`elif\` s'excluent mutuellement : dès qu'une condition est vraie, Python ignore toutes les suivantes.

---

#### 5. Exercices Bonus "Live" (Prêts à l'emploi)

**Exercice A : Détecteur d'années bissextiles (Niveau Moyen)**
*Consigne :* Créez un programme qui demande une année à l'utilisateur et détermine si elle est bissextile (divisible par 4, mais pas par 100 sauf si elle est aussi divisible par 400).
\`\`\`python
annee = int(input("Entrez une année : "))
if (annee % 4 == 0 and annee % 100 != 0) or (annee % 400 == 0):
    print(f"L'année {annee} est bissextile !")
else:
    print(f"L'année {annee} n'est pas bissextile.")
\`\`\`

**Exercice B : La Caisse de Cinéma (Niveau Difficile)**
*Consigne :* Écrivez un script qui demande l'âge de l'utilisateur et s'il possède une carte de réduction. Le tarif normal est de 10€. Les moins de 18 ans paient 6€. Les porteurs de la carte bénéficient de 20% de réduction sur leur tarif d'éligibilité.
\`\`\`python
age = int(input("Votre âge : "))
carte = input("Carte de réduction (oui/non) : ").lower() == "oui"

if age < 18:
    tarif_base = 6.0
else:
    tarif_base = 10.0

if carte:
    tarif_final = tarif_base * 0.8
else:
    tarif_final = tarif_base

print(f"Le tarif appliqué est de : {tarif_final:.2f}€")
\`\`\`
`
  },
  {
    id: 3,
    phase: 'Débutant',
    title: 'Boucles et Répétitions',
    description: 'Découvrez les structures itératives pour exécuter du code à répétition sans vous fatiguer.',
    topics: [
      'Boucles while : syntaxe et conditions d’arrêt',
      'Boucles for : itération et fonction range()',
      'Mots-clés de contrôle : break et continue',
      'Imbrication et patterns répétitifs'
    ],
    contentMarkdown: `### 1. Introduction aux Itérations : La Force de l'Automatisation
L'une des plus grandes forces de l'informatique est sa capacité à exécuter des milliards de calculs répétitifs sans jamais se fatiguer ni commettre d’erreur d'inattention. En programmation, répéter un bloc d'instructions s'appelle **itérer**.

Sans structure de boucle, pour afficher dix fois le mot "Bonjour", nous devrions écrire dix fois la commande \`print()\`. Avec les boucles, nous pouvons répéter du code une infinité de fois en quelques lignes propres, dynamiques et élégantes.

---

### 2. La Boucle \`while\` : Tourner tant que la condition reste vraie
La boucle **\`while\`** (qui signifie « tant que ») répète des instructions de manière indéfinie tant qu'une condition logique spécifique s'évalue à \`True\`. Elle s'apparente à une structure conditionnelle \`if\` qui s'exécuterait plusieurs fois d'affilée.

#### A. Syntaxe de base
\`\`\`python
nombre_de_tours = 1
while nombre_de_tours <= 5:
    print(f"J'effectue le tour numéro {nombre_de_tours}")
    nombre_de_tours += 1  # Étape cruciale : modifier la condition !
\`\`\`

#### B. ⚠️ Le piège mortel de la boucle infinie
Dans une boucle \`while\`, l'interpréteur vérifie la condition à chaque début d'itération. Si cette condition reste éternellement vraie (\`True\`), le programme tournera à l'infini, figeant votre console ou consommant inutilement vos ressources !
*Pour l'éviter, vous devez impérativement vous assurer que le corps de la boucle modifie au moins une variable de la condition de façon à ce qu'elle devienne \`False\` à un moment donné.*

\`\`\`python
# ❌ ERREUR TRAGIQUE : variable jamais modifiée -> Boucle Infinie !
compteur = 1
while compteur <= 5:
    print(compteur)
    # Oubli de l'incrémentation 'compteur += 1'
\`\`\`

#### C. Exemple concret de validation interactive
La boucle \`while\` est parfaite lorsque l'on **ne connaît pas par avance le nombre exact de répétitions requises** (par exemple, attendre qu'un utilisateur saisisse une valeur correcte).
\`\`\`python
mot_de_passe = ""
while mot_de_passe != "express123":
    mot_de_passe = input("Saisissez votre mot de passe d'accès : ")
print("Identifié avec succès !")
\`\`\`

---

### 3. La Boucle \`for\` : Parcourir des séquences et des collections
La boucle **\`for\`** (qui signifie « pour chaque ») est idéale lorsque l'on **connaît à l'avance le nombre d'itérations à effectuer**, ou lorsque l'on souhaite parcourir un ensemble d'éléments (les lettres d'un mot, ou les éléments d'une collection).

#### A. Parcourir une chaîne de caractères
L'interpréteur extrait automatiquement chaque caractère, un par un, de la gauche vers la droite :
\`\`\`python
for lettre in "PYTHON":
    print(f"Lettre active : {lettre}")
\`\`\`

#### B. La Fonction Magique \`range()\`
En Python, pour répéter un bloc un nombre précis de fois, on associe la boucle \`for\` à la fonction intégrée **\`range()\`**. Cette fonction génère une suite arithmétique d'entiers à la volée de manière ultra-optimisée en mémoire.

La fonction \`range()\` s'utilise de trois manières complémentaires :

| Syntaxe | Action générée | Exemple d'itération | Valeurs produites |
| :--- | :--- | :--- | :--- |
| **\`range(stop)\`** | Génère de \`0\` à \`stop - 1\` | \`range(4)\` | \`0, 1, 2, 3\` (le 4 est strictement exclu) |
| **\`range(start, stop)\`** | Débute à \`start\`, s'arrête à \`stop - 1\` | \`range(5, 9)\` | \`5, 6, 7, 8\` (le 9 est exclu) |
| **\`range(start, stop, step)\`** | Débute à \`start\`, avance par pas de \`step\` | \`range(10, 20, 3)\` | \`10, 13, 16, 19\` (le 20 est exclu) |

*Exemple avec un pas négatif (compte à rebours) :*
\`\`\`python
for i in range(3, 0, -1):
    print(f"Décollage dans {i}...")
print("Décollage réussi !")
\`\`\`

---

### 4. Contrôler finement ses Boucles : \`break\` et \`continue\`
Ces mots-clés modifient le comportement normal d'exécution d'une boucle à la volée.

#### A. Le mot-clé \`break\` : Sortie d'urgence
L'instruction **\`break\`** interrompt instantanément l'exécution globale de la boucle en cours d'exécution et renvoie l'interrreteur directement à la première ligne de code qui suit la structure de boucle.
\`\`\`python
# Recherche de la première valeur supérieure à 100
for nombre in [12, 45, 120, 80, 200]:
    if nombre > 100:
        print(f"Cible identifiée : {nombre}")
        break  # On stoppe immédiatement les recherches superflues !
\`\`\`

#### B. Le mot-clé \`continue\` : Passer au tour suivant
L'instruction **\`continue\`** n'arrête pas la boucle entière. Elle met fin de façon prématurée à l'**itération courante**, en ignorant toutes les lignes de code situées en dessous d'elle pour sauter immédiatement au début du tour suivant.
\`\`\`python
# Afficher les nombres sauf le chiffre maudit 13
for etage in range(11, 16):
    if etage == 13:
        continue  # On passe à l'étage 14 sans exécuter l'affichage en dessous !
    print(f"Bienvenue au n°{etage}")
\`\`\`

---

### 5. Une exclusivité originale : Le bloc \`else\` sur les boucles
En Python, vous pouvez greffer facultativement un bloc **\`else\`** directement après une boucle \`for\` ou \`while\`.
- Ce bloc s'exécute **uniquement** si la boucle s'est terminée **naturellement** (en allant jusqu'au bout, sans rencontrer de \`break\`).
- Si la boucle est brutalement interrompue par un \`break\`, le bloc \`else\` est totalement prévenu et ignoré.

\`\`\`python
for i in range(3):
    print(i)
else:
    print("Boucle terminée sans encombre !")  # S'affiche
\`\`\`

---

### 6. Les Boucles Imbriquées : Multiplier les dimensions
Une boucle peut parfaitement se loger à l'intérieur d'une autre boucle. À chaque tour unique de la boucle externe, la boucle interne s'exécute dans sa totalité.

> 🛠️ **Analogue de repère** : Pensez à l'aiguille des minutes d'une horloge. Elle doit boucler 60 fois à l'intérieur de sa structure pour que l'aiguille externe des heures n'avance que d'une seule unité.

*Exemple : Génération de coordonnées 2D (Lignes / Colonnes)*
\`\`\`python
for ligne in range(1, 3):
    for col in range(1, 4):
        print(f"Case : ({ligne}, {col})")
\`\`\`

---

### 7. Vos 3 Règles d'Or pour Réussir
1. **Choisissez le bon outil** : Utilisez \`for\` si vous connaissez le nombre d'itérations, privilégiez \`while\` si la fin de la répétition dépend d'une condition d'état incertaine.
2. **Évitez le piège infini** : En écrivant une boucle \`while\`, commencez toujours par concevoir sa condition de sortie et son incrémentation logique avant de rédiger le corps.
3. **Optimisez les imbrications** : Les boucles imbriquées ralentissent la vitesse de calcul si le volume de données devient immense. Veillez à ne pas en abuser inutilement.`,
    codeExample: `# Exemple d'analyse de données avec interruption de boucle
print("Début de l'analyse sélective...")
for num in range(1, 10):
    if num % 2 != 0:
        continue  # On passe au suivant si le nombre est impair
    print(f"Nombre pair trouvé : {num}")
    if num == 6:
        print("Cible critique 6 atteinte, arrêt prématuré !")
        break`,
    expectedOutput: `Début de l'analyse sélective...
Nombre pair trouvé : 2
Nombre pair trouvé : 4
Nombre pair trouvé : 6
Cible critique 6 atteinte, arrêt prématuré !`
  },
  {
    id: 4,
    phase: 'Débutant',
    title: 'Collections - Listes et Tuples',
    description: 'Stockez, modifiez et manipulez des ensembles ordonnés de données avec aisance.',
    topics: [
      'Listes: création, indexation et slicing (découpage)',
      'Méthodes clés: append(), insert(), remove(), pop(), sort()',
      'Itération sur des listes avec la boucle for',
      'Tuples: concept d’immutabilité et cas d’usage'
    ],
    contentMarkdown: `### 1. Introduction aux Séquences : Dépasser les Variables Simples
Jusqu'à présent, nos variables se comportaient comme des boîtes individuelles : une variable = une valeur (\`age = 25\`). Mais comment faire si nous devons gérer une classe de 30 élèves, un catalogue de 1000 produits ou les coordonnées X/Y d'un point ? Créer 1000 variables différentes (\`produit_1\`, \`produit_2\`, ...) serait ingérable.

C'est ici qu'interviennent les **collections** (ou structures de données). Elles permettent de regrouper et d'organiser plusieurs éléments sous une seule et même étiquette. Aujourd'hui, nous explorons les deux séquences ordonnées les plus fondamentales de Python : les **Listes** et les **Tuples**.

---

### 2. Les Listes (\`list\`) : La Collection à Tout Faire
Une liste est une collection **ordonnée** (chaque élément a une place précise) et **mutable** (on peut la modifier à volonté après sa création).

#### A. Création et Structure
En Python, une liste est définie en encadrant ses éléments avec des **crochets \`[]\`**, séparés par des virgules.
\`\`\`python
# Une liste homogène (même type)
temperatures = [18.5, 20.1, 22.4, 19.8]

# Une liste hétérogène (types multiples acceptés !)
profil_mixte = ["Alice", 28, True, 3.14]

# Une liste vide (prête à être remplie)
panier = []
\`\`\`

#### B. Indexation : Accéder à un élément précis
Chaque élément possède un "numéro de place" appelé **index**. 
⚠️ **Attention** : En informatique, on commence toujours à compter à partir de **zéro** !
\`\`\`python
fruits = ["Pomme", "Banane", "Cerise", "Datte"]
print(fruits[0])  # Affiche Pomme
print(fruits[2])  # Affiche Cerise
\`\`\`
Python propose une astuce géniale : les **index négatifs** pour compter à partir de la fin :
\`\`\`python
print(fruits[-1]) # Affiche Datte (le tout dernier élément)
print(fruits[-2]) # Affiche Cerise (l'avant-dernier)
\`\`\`

#### C. Slicing : Découper une liste (Tranchage)
Le *slicing* permet d'extraire une sous-partie de la liste avec la syntaxe \`liste[debut:fin:pas]\`.
- Le \`debut\` est inclus.
- La \`fin\` est **strictement exclue**.
\`\`\`python
lettres = ["A", "B", "C", "D", "E"]
print(lettres[1:4])  # Extrait de l'index 1 au 3 inclus -> ['B', 'C', 'D']
print(lettres[:3])   # Du début jusqu'à l'index 2 -> ['A', 'B', 'C']
print(lettres[::-1]) # Astuce : Inverse totalement la liste !
\`\`\`

---

### 3. Manipuler les Listes : L'Arsenal des Méthodes
Puisque les listes sont *mutables*, Python intègre des "méthodes" (des fonctions attachées à l'objet liste) pour les altérer.

| Action | Méthode / Syntaxe | Description et Exemple |
| :--- | :--- | :--- |
| **Ajouter à la fin** | \`.append(x)\` | Ajoute \`x\` tout à la fin : \`panier.append("Pain")\` |
| **Insérer au milieu**| \`.insert(i, x)\` | Insère \`x\` à l'index \`i\` : \`panier.insert(0, "Lait")\` |
| **Supprimer par nom**| \`.remove(x)\` | Détruit la 1ère occurrence de \`x\` : \`panier.remove("Lait")\` |
| **Extraire par index**| \`.pop(i)\` | Retire et renvoie l'élément à l'index \`i\` (ou le dernier si \`i\` est vide). |
| **Remplacer** | \`liste[i] = x\` | Écrase la valeur à l'index \`i\` : \`panier[1] = "Beurre"\` |
| **Trier** | \`.sort()\` | Trie la liste (alphabétique ou croissant) : \`nombres.sort(reverse=True)\` |
| **Connaître la taille**| \`len(liste)\` | Renvoie le nombre total d'éléments : \`len(panier)\` |

---

### 4. Parcourir une Liste : La puissance de \`for\`
La boucle \`for\` est naturellement conçue pour itérer sur les listes élément par élément, sans même avoir besoin de gérer les index.

\`\`\`python
invites = ["Paul", "Marie", "Luc"]
for personne in invites:
    print(f"Bienvenue à la fête, {personne} !")
\`\`\`
Si vous avez *aussi* besoin de connaître le numéro de la place pendant le parcours, utilisez \`enumerate()\` :
\`\`\`python
for index, personne in enumerate(invites):
    print(f"Invité n°{index} : {personne}")
\`\`\`

---

### 5. Les Tuples (\`tuple\`) : La Collection Blindée
Un *tuple* ressemble fortement à une liste, mais se distingue par deux différences majeures :
1. Sa syntaxe utilise des **parenthèses \`()\`**.
2. Il est **IMMUABLE**. Une fois créé, il est verrouillé et figé dans le marbre. Impossible d'ajouter, de supprimer ou de modifier le moindre élément.

\`\`\`python
coordonnees = (48.8566, 2.3522)
print(coordonnees[0]) # Accès autorisé (48.8566)

# coordonnees[0] = 50.0  ❌ ERREUR FATALE : TypeError! (L'objet 'tuple' ne supporte pas l'assignation)
# coordonnees.append(1.0) ❌ ERREUR FATALE : Un tuple n'a pas de méthode append!
\`\`\`

#### Pourquoi utiliser un Tuple plutôt qu'une Liste ?
- **Sécurité** : Protéger des données constantes (comme une adresse IP de serveur, des constantes mathématiques) contre les altérations accidentelles par d'autres parties du code.
- **Performance** : Les tuples sont plus légers en mémoire et légèrement plus rapides à parcourir que les listes.
- **Clés de dictionnaire** : (Concept avancé) Contrairement aux listes, les tuples peuvent servir de clés dans les dictionnaires car ils sont inaltérables.`,
    codeExample: `# Manipulation complète d'une liste de cours
cours = ["Python", "HTML", "CSS"]

# 1. Modifications dynamiques
cours.append("JavaScript")
cours.insert(1, "Git")
del cours[2] # Supprime "HTML" à l'index 2

print("Liste finale ordonnée :", sorted(cours))
print("Dernier cours ajouté :", cours[-1])
print("Slicing (les deux premiers) :", cours[:2])

print("-" * 20)

# 2. Parcours automatisé
print("Début du parcours :")
for idx, matiere in enumerate(cours):
    print(f"  Module {idx + 1} : {matiere}")

print("-" * 20)

# 3. Tuple (Collection immuable)
coordonnees = (48.8566, 2.3522)
print(f"Géo-localisation figée : Latitude {coordonnees[0]}, Longitude {coordonnees[1]}")`,
    expectedOutput: `Liste finale ordonnée : ['CSS', 'Git', 'JavaScript', 'Python']
Dernier cours ajouté : JavaScript
Slicing (les deux premiers) : ['Python', 'Git']
--------------------
Début du parcours :
  Module 1 : Python
  Module 2 : Git
  Module 3 : CSS
  Module 4 : JavaScript
--------------------
Géo-localisation figée : Latitude 48.8566, Longitude 2.3522`
  },
  {
    id: 5,
    phase: 'Débutant',
    title: 'Collections - Dictionnaires et Sets',
    description: 'Représentez des données complexes sous forme de clés/valeurs ou assemblez des valeurs uniques.',
    topics: [
      'Dictionnaires: concepts de clés, valeurs et paires clé-valeur',
      'Accès et méthodes: [], get(), keys(), values(), items()',
      'Sets: création, opérations de théorie des ensembles (union, intersection, différence)',
      'Pratique de modélisation'
    ],
    contentMarkdown: `### 1. Au-delà des Listes : Structurer par "Clés"
Les listes sont parfaites pour des données séquentielles (le 1er élément, le 2ème, etc.). Mais si vous voulez stocker un profil utilisateur, une liste \`["Paul", 28, "Paris"]\` vous oblige à vous souvenir que l'index 0 est le prénom, l'index 1 est l'âge, etc. C'est source d'erreurs !

La solution ? Les **Dictionnaires** (\`dict\`) ! Ils ne fonctionnent pas avec des index numériques (0, 1, 2) mais avec des **clés** textuelles (comme les mots dans un vrai dictionnaire).

---

### 2. Les Dictionnaires (\`dict\`) : Paires Clé-Valeur
Un dictionnaire s'écrit avec des accolades \`{}\`. Chaque élément est une paire séparée par les deux-points \`clé: valeur\`.
\`\`\`python
# Création d'un dictionnaire
utilisateur = {
    "pseudo": "Gamer99",
    "niveau": 42,
    "premium": True
}
\`\`\`

#### A. Lire et Modifier des valeurs
Pour lire une donnée, on demande sa clé entre crochets \`[]\` :
\`\`\`python
print(utilisateur["pseudo"])  # Affiche "Gamer99"

# Si la clé n'existe pas, cela provoque une ERREUR (KeyError) !
# print(utilisateur["age"])  <- BOOM ! 💥
\`\`\`
Pour éviter que le programme ne plante si la clé est manquante, utilisez la méthode magique \`.get()\` :
\`\`\`python
print(utilisateur.get("age")) # Renvoie sagement None au lieu de planter
print(utilisateur.get("age", 18)) # Renvoie 18 (valeur par défaut) si "age" est introuvable
\`\`\`
Pour modifier ou ajouter une donnée, c'est aussi intuitif qu'une variable :
\`\`\`python
utilisateur["niveau"] = 43  # Modifie la valeur existante
utilisateur["email"] = "gamer@mail.com" # Crée une nouvelle clé-valeur
\`\`\`

#### B. Itérer sur un Dictionnaire
Comment parcourir un objet complexe constitué de clés et de valeurs ?
Python propose 3 méthodes distinctes selon vos besoins :

**1. Parcourir uniquement les clés (\`.keys()\`)**
\`\`\`python
for cle in utilisateur.keys():
    print("Propriété disponible :", cle)
# Affiche:
# Propriété disponible : pseudo
# Propriété disponible : niveau
\`\`\`

**2. Parcourir uniquement les valeurs (\`.values()\`)**
\`\`\`python
for valeur in utilisateur.values():
    print("Valeur stockée :", valeur)
# Affiche:
# Valeur stockée : Gamer99
# Valeur stockée : 42
\`\`\`

**3. Parcourir les deux en même temps (\`.items()\`)**
C'est la méthode la plus puissante et la plus utilisée :
\`\`\`python
for cle, valeur in utilisateur.items():
    print(f"Sa propriété '{cle}' a pour valeur '{valeur}'")
# Affiche:
# Sa propriété 'pseudo' a pour valeur 'Gamer99'
# Sa propriété 'niveau' a pour valeur '42'
\`\`\`

---

### 3. Les Ensembles (\`set\`) : Les Collections Uniques
Les Sets s'écrivent aussi avec des accolades \`{}\`, mais sans les deux-points. Ce sont des sacs de données **non ordonnés** qui ont un super-pouvoir : **ils détruisent automatiquement les doublons !**

\`\`\`python
# Création (les doublons vont fusionner de force en un seul)
fruits = {"Pomme", "Banane", "Cerise", "Pomme", "Banane"}
print(fruits) # Affichera {'Pomme', 'Banane', 'Cerise'} dans un ordre imprévisible
\`\`\`

#### Pourquoi utiliser des Sets ? La théorie des ensembles !
Les Sets sont conçus et ultra-optimisés pour comparer des groupes entiers (exactement comme les diagrammes de Venn en mathématiques).

Voici le détail de chaque opération fondamentale :

**A. L'Union (\`|\` ou \`.union()\`)** 
Rassemble tous les éléments des deux ensembles en détruisant les doublons.
\`\`\`python
groupe_1 = {"Alice", "Bob"}
groupe_2 = {"Bob", "Charlie"}
tous_les_eleves = groupe_1.union(groupe_2)
print(tous_les_eleves) # {'Alice', 'Bob', 'Charlie'}
\`\`\`

**B. L'Intersection (\`&\` ou \`.intersection()\`)** 
Conserve **uniquement** les éléments qui sont présents à la fois dans le groupe A ET dans le groupe B.
\`\`\`python
amis_paul = {"Léa", "Marc", "Hugo"}
amis_marie = {"Hugo", "Julie", "Léa"}
amis_en_commun = amis_paul.intersection(amis_marie)
print(amis_en_commun) # {'Léa', 'Hugo'}
\`\`\`

**C. La Différence (\`-\` ou \`.difference()\`)** 
Conserve les éléments du groupe A, mais en **retirant** ceux qui appartiennent aussi au groupe B (ce que A possède, mais que B n'a pas).
\`\`\`python
competences_requises = {"Python", "Git", "SQL"}
competences_etudiant = {"Python", "HTML"}
manquantes = competences_requises.difference(competences_etudiant)
print(manquantes) # {'Git', 'SQL'}
\`\`\`

C'est redoutable pour comparer rapidement des données en quelques microsecondes !`,
    codeExample: `# Modélisation complexe : Un profil de Héros RPG

heros = {
    "nom": "Arthur",
    "classe": "Guerrier",
    "points_de_vie": 150,
    "inventaire": ["Épée", "Bouclier", "Potion"] # Une liste DANS un dictionnaire !
}

print("--- STATUT DU HÉROS ---")
# On ajoute une nouvelle propriété
heros["niveau"] = 5 
# On accède à une sous-propriété (le 3ème objet de son inventaire)
print(f"{heros['nom']} a bu sa {heros['inventaire'][2]} !")
heros['inventaire'].pop() # Il la boit, donc on l'enlève !

print("\\n--- INVENTAIRE FINAL ---")
for cle, valeur in heros.items():
    print(f"  > {cle.capitalize()} : {valeur}")

print("\\n--- ANALYSE DE COMPÉTENCES (SETS) ---")
competences_requises = {"Épée à 2 mains", "Parade", "Cavalier"}
competences_acquises = {"Parade", "Cuisine", "Cavalier"}

print("Compétences valides pour le niveau supérieur :")
print(competences_requises.intersection(competences_acquises))

print("Compétences manquantes à apprendre :")
print(competences_requises.difference(competences_acquises))`,
    expectedOutput: `--- STATUT DU HÉROS ---
Arthur a bu sa Potion !

--- INVENTAIRE FINAL ---
  > Nom : Arthur
  > Classe : Guerrier
  > Points_de_vie : 150
  > Inventaire : ['Épée', 'Bouclier']
  > Niveau : 5

--- ANALYSE DE COMPÉTENCES (SETS) ---
Compétences valides pour le niveau supérieur :
{'Cavalier', 'Parade'}
Compétences manquantes à apprendre :
{'Épée à 2 mains'}`
  },
  {
    id: 6,
    phase: 'Débutant',
    title: 'Fonctions - Définition et Appel',
    description: 'Rendez votre code réutilisable et modulaire en divisant vos programmes en blocs logiques nommés.',
    topics: [
      'Définition avec "def", paramètres et arguments',
      'Valeurs de retour avec l’instruction return',
      'Portée des variables (Variables locales vs globales)',
      'Arguments optionnels (valeurs par défaut) et nommés'
    ],
    contentMarkdown: `### 1. La Philosophie des Fonctions : DRY (Don't Repeat Yourself)
Jusqu'ici, nous écrivions notre code de haut en bas. Mais si vous devez calculer l'âge de 50 utilisateurs à différents endroits de votre programme, vous n'allez pas copier-coller la même formule 50 fois ! 

Une **fonction** est une "mini-usine". Vous lui donnez des matières premières (les **arguments**), elle effectue un travail caché à l'intérieur (le **bloc de code**), et elle vous renvoie un produit fini (le **retour**).

---

### 2. Définir et Appeler une Fonction
En Python, on crée une fonction avec le mot-clé \`def\` (pour *define*), suivi du nom de la fonction, de parenthèses et de deux-points \`:\`. Le code qui appartient à la fonction doit obligatoirement être **indenté**.

\`\`\`python
# 1. DÉFINITION de la fonction (l'usine est construite, mais ne tourne pas encore)
def dire_bonjour():
    print("Bonjour et bienvenue dans le programme !")

# 2. APPEL de la fonction (on allume l'usine et on l'exécute)
dire_bonjour()  # Affiche le message
\`\`\`

---

### 3. Les Paramètres et les Arguments
Pour qu'une fonction soit flexible et réutilisable, on peut lui passer des variables entre ses parenthèses. Ce sont les **paramètres**.
\`\`\`python
def saluer(nom, age): # 'nom' et 'age' sont les paramètres attendus
    print(f"Salut {nom}, tu as {age} ans !")

saluer("Alice", 25) # "Alice" et 25 sont les arguments fournis à l'appel
\`\`\`

#### Paramètres avec valeur par défaut (Optionnels)
Vous pouvez rendre un argument facultatif en lui donnant une valeur de base avec le signe \`=\`. **Attention** : Les paramètres par défaut doivent toujours être placés *à la fin* de la liste entre les parenthèses.
\`\`\`python
def reserver_billet(destination, classe="Économique"):
    print(f"Billet pour {destination} en classe {classe}.")

reserver_billet("Tokyo")                # Affiche: Billet pour Tokyo en classe Économique.
reserver_billet("New York", "Affaires") # Écrase la valeur par défaut
\`\`\`

#### Arguments Nommés (Keyword Arguments)
Lors de l'appel de la fonction, vous pouvez préciser le nom explicite du paramètre. L'ordre n'a alors plus aucune importance !
\`\`\`python
saluer(age=30, nom="Bob") # L'ordre est inversé, mais Python associe correctement les valeurs !
\`\`\`

---

### 4. Le Renvoi de Valeur : \`return\` vs \`print\`
**C'est l'erreur numéro 1 des débutants en programmation !**
- \`print()\` sert **uniquement** à afficher du texte sur l'écran pour l'humain. Le programme lui-même ne "capture" aucune donnée.
- \`return\` ordonne à la fonction de **recracher une donnée** vers le programme, pour que l'ordinateur puisse la stocker dans une variable et continuer à faire des calculs avec. 

*Note vitale : Dès que Python croise le mot \`return\`, la fonction s'arrête instantanément. Tout code écrit en dessous ne sera jamais lu.*

\`\`\`python
def carre_mauvais(x):
    print(x * x) # Affiche le résultat, mais ne renvoie RIEN (None) au système

def carre_bon(x):
    return x * x # Renvoie silencieusement le calcul au programme

resultat = carre_bon(5) # 'resultat' contient maintenant la valeur 25
resultat_suivant = resultat + 10 # L'addition est possible uniquement parce qu'on a utilisé return !
\`\`\`

---

### 5. La Portée des Variables (Le concept de "Scope")
Les variables créées *à l'intérieur* d'une fonction sont dites **locales**. Elles naissent lors de l'appel de la fonction et sont brutalement détruites dès que la fonction se termine (afin de libérer la RAM). Le reste du programme ne peut donc pas y accéder.

\`\`\`python
secret_global = "Je suis visible partout"

def espion():
    secret_local = "Je suis invisible de l'extérieur"
    print(secret_global) # Fonctionne ! La fonction a accès à l'extérieur.

espion()
# print(secret_local) <- ERREUR FATALE (NameError), la variable locale n'existe plus !
\`\`\`

---

### 6. Bonus Pro : La Documentation (Docstring)
Un bon développeur explique ce que fait sa fonction pour ses collègues ou son futur "lui". On utilise les triples guillemets \`"""\` juste sous la définition \`def\`. Votre éditeur de code l'affichera au survol de la fonction !
\`\`\`python
def additionner(a, b):
    """
    Additionne deux nombres et renvoie le résultat.
    """
    return a + b
\`\`\``,
    codeExample: `# Un programme complet combinant les facettes des fonctions

def calculer_prix_ttc(prix_ht, taxe=0.20):
    """
    Convertit un prix Hors Taxe en Toutes Taxes Comprises.
    La taxe par défaut est de 20% (0.20).
    """
    prix_final = prix_ht + (prix_ht * taxe)
    return prix_final

def afficher_facture(client, montant_ht):
    # Les fonctions peuvent s'appeler entre elles !
    total = calculer_prix_ttc(montant_ht) 
    
    print("-" * 30)
    print(f"Facture pour le client : {client.capitalize()}")
    print(f"Montant HT  : {montant_ht:.2f} €")
    print(f"Montant TTC : {total:.2f} €")
    print("-" * 30)

# 1. Utilisation classique (la taxe par défaut de 20% s'applique automatiquement)
afficher_facture("Alice", 100.0)

# 2. Utilisation avec une valeur spécifique (TVA réduite à 5.5%)
# Le 'return' nous permet de récupérer la donnée pour l'imprimer directement
total_reduit = calculer_prix_ttc(100.0, 0.055)
print(f"Prix avec taxe réduite : {total_reduit} €")

# 3. Utilisation des arguments nommés pour ignorer totalement l'ordre
total_etranger = calculer_prix_ttc(taxe=0.15, prix_ht=200.0)
print(f"Prix avec paramètres nommés inversés : {total_etranger} €")`,
    expectedOutput: `------------------------------
Facture pour le client : Alice
Montant HT  : 100.00 €
Montant TTC : 120.00 €
------------------------------
Prix avec taxe réduite : 105.5 €
Prix avec paramètres nommés inversés : 230.0 €`
  },
  {
    id: 7,
    phase: 'Débutant',
    title: 'Révision et Chaînes de Caractères',
    description: 'Une journée de synthèse pour maîtriser le formatage des textes et consolider les acquis de la phase débutant.',
    topics: [
      'Méthodes de chaînes de caractères (upper, lower, replace, split, join)',
      'Formatage avancé: f-strings et utilisation de format()',
      'Entrées/Sorties simples de fichiers texte',
      'Exercice bilan de révision générale'
    ],
    contentMarkdown: `### 1. Le pouvoir caché des Chaînes de Caractères (Strings)
En Python, le texte (les chaînes de caractères, ou \`str\`) n'est pas qu'une simple suite de lettres inertes. Ce sont des objets "intelligents" livrés avec une véritable boîte à outils intégrée (les "méthodes").

Pour utiliser ces outils, on tape le nom de la variable contenant le texte, suivi d'un point \`.\`, puis le nom de l'outil et ses parenthèses \`()\`.

#### A. Nettoyer et Modifier la Casse (Majuscules/Minuscules)
C'est idéal quand vous demandez à un utilisateur d'entrer son email et qu'il ajoute des espaces par erreur.
\`\`\`python
texte = "   bOnjOur MOnde!   "

print(texte.strip())       # "bOnjOur MOnde!" (Retire les espaces au début et à la fin)
print(texte.lower())       # "   bonjour monde!   " (Tout en minuscules)
print(texte.upper())       # "   BONJOUR MONDE!   " (Tout en majuscules)
print(texte.capitalize())  # "   bonjour monde!   " (1ère lettre en majuscule)

# On peut même enchaîner les méthodes (le chaînage) !
print(texte.strip().lower().capitalize()) # "Bonjour monde!"
\`\`\`

#### B. Remplacer et Découper
Vous voulez corriger un mot dans une longue phrase ? Ou la découper en liste de mots séparés ?
\`\`\`python
phrase = "J'aime les pommes et les bananes"

# 1. Remplacer (.replace)
nouvelle_phrase = phrase.replace("pommes", "fraises")
print(nouvelle_phrase) # "J'aime les fraises et les bananes"

# 2. Découper en liste (.split)
liste_mots = phrase.split(" ") # On coupe à chaque espace trouvé
print(liste_mots) # ["J'aime", "les", "pommes", "et", "les", "bananes"]

# 3. Rassembler une liste en texte (.join)
texte_reconstruit = " - ".join(liste_mots)
print(texte_reconstruit) # "J'aime - les - pommes - et - les - bananes"
\`\`\`

---

### 2. Le Formatage Moderne : Les f-strings (Magie 🪄)
Auparavant, mélanger du texte et des variables en Python était laborieux. Aujourd'hui, il existe les **f-strings** (format strings). 
Placez simplement la lettre \`f\` minuscule **avant** les guillemets de votre texte. Dès lors, toutes les accolades \`{}\` à l'intérieur du texte deviendront des "zones de calcul" Python !

\`\`\`python
prenom = "Alice"
age = 30
solde = 1450.5678

# La magie opère : Python remplace les accolades par la valeur des variables
print(f"Bonjour {prenom}, l'année prochaine tu auras {age + 1} ans.")

# On peut même formater l'affichage des nombres ! (ex: forcer 2 chiffres après la virgule)
print(f"Votre solde est de : {solde:.2f} €") # Affiche : "Votre solde est de : 1450.57 €"
\`\`\`

---

### 3. Les Fichiers : Sauvegarder sur votre Disque Dur
Jusqu'à présent, nos données disparaissaient dès qu'on fermait le programme. Il est temps de créer un vrai fichier texte sur votre ordinateur de manière permanente !

Python utilise la commande \`open()\` accompagnée du gestionnaire de contexte \`with\`. Le mot \`with\` est génial car **il ferme automatiquement le fichier pour vous** dès que vous avez terminé (ce qui évite de corrompre vos données ou de faire planter l'ordinateur).

#### Écrire dans un fichier (\`"w"\` pour *write*)
\`\`\`python
# Le mode "w" crée le fichier (ou écrase l'ancien s'il existait déjà !)
with open("mon_journal.txt", "w") as fichier:
    fichier.write("Cher journal, aujourd'hui j'ai appris Python.\\n")
    fichier.write("Les f-strings, c'est vraiment fantastique !")
\`\`\`

#### Lire un fichier (\`"r"\` pour *read*)
\`\`\`python
# Le mode "r" permet de lire le contenu sans le modifier
with open("mon_journal.txt", "r") as fichier:
    contenu_complet = fichier.read()
    print("Voici ce que contient le fichier :")
    print(contenu_complet)
\`\`\`
*Et voilà ! Vous savez maintenant formater des textes proprement et sauvegarder vos résultats.*`,
    codeExample: `# Bilan du Débutant : Outil de traitement d'inscriptions

def traiter_candidature(nom_brut, age, passion):
    """Nettoie le nom et génère un badge de membre."""
    # 1. Chaînage de méthodes (Enlever espaces marginaux + Mettre en majuscules)
    nom_propre = nom_brut.strip().upper()
    
    # 2. Formatage avec f-string et petite condition dans les accolades
    badge = f"*** BADGE OFFICIEL ***\\nNom : {nom_propre}\\nCatégorie : {'Majeur' if age >= 18 else 'Mineur'}\\nPassion : {passion.capitalize()}"
    return badge

# Simulation de données reçues sur un site web (mal formatées, pleines d'espaces)
noms_recus = "  dupont  ,   martin,   LEROY"

# 1. Découpage de la chaîne en une vraie liste
liste_noms = noms_recus.split(",")

# 2. On traite le premier candidat
badge_candidat_1 = traiter_candidature(liste_noms[0], 25, "programmation")

print(badge_candidat_1)

# 3. Écriture (sauvegarde) de ce badge dans un fichier
print("\\n[Système] Sauvegarde du fichier 'badge.txt' en cours...")
with open("badge_dupont.txt", "w") as fichier:
    fichier.write(badge_candidat_1)

print("[Système] Sauvegarde terminée avec succès !")`,
    expectedOutput: `*** BADGE OFFICIEL ***
Nom : DUPONT
Catégorie : Majeur
Passion : Programmation

[Système] Sauvegarde du fichier 'badge.txt' en cours...
[Système] Sauvegarde terminée avec succès !`
  },

  // --- PHASE 2: INTERMÉDIAIRE (JOURS 8-14) ---
  {
    id: 8,
    phase: 'Intermédiaire',
    title: 'Gestion de Fichiers Avancée',
    description: 'Découvrez la manipulation sécurisée de fichiers volumineux et la traversée de vos arborescences système.',
    topics: [
      'Modes standard: open(), read(), write(), append()',
      'Context Managers: l’expression indispensable with',
      'Lecture optimale ligne par ligne pour préserver la RAM',
      'Chemins systèmes propres grâce au module pathlib'
    ],
    contentMarkdown: `### Travailler de Manière Sûre avec le Disque Dur

Bienvenue dans la Phase Intermédiaire ! Aujourd'hui, nous sortons de la mémoire vive pour interagir de façon sécurisée avec l'espace de stockage.

#### 1. Ouvrir des fichiers proprement
Ouvrir un fichier manuellement via \`f = open()\` nécessite de toujours de penser à appeler \`f.close()\` sous peine de bloquer la ressource système. C'est pourquoi on utilise un **Context Manager** (\`with\`), qui gère la fermeture automatique pour nous !

#### 2. Les Différents Modes d'Ouverture :
- \`"r"\` (Read) : Lecture seule (erreur si le fichier n'existe pas).
- \`"w"\` (Write) : Écriture pure (écrase le contenu existant s'il existe).
- \`"a"\` (Append) : Ajout (ajoute du texte à la fin du fichier sans effacer).

#### 3. Représentation Moderne des Chemins avec \`pathlib\`
Exit les chemins concaténés avec des chaînes de caractères (\`"C:/dossier/" + "fichier.txt"\`), utilisez le module moderne standard de Python \`pathlib\` :
\`\`\`python
from pathlib import Path
chemin = Path("dossier") / "fichier.txt"
if chemin.exists():
    print(chemin.name, "est bien présent !")
\`\`\``,
    codeExample: `# Simulation de lecture cursive et écriture sélective de logs
from pathlib import Path

# Création virtuelle d'un log pour simuler
logs_path = Path("app_logs.txt")
with open(logs_path, "w") as logs:
    logs.write("[INFO] Démarrage du système\\n")
    logs.write("[WARNING] Utilisation CPU élevée\\n")
    logs.write("[INFO] Arrêt standard")

# Lecture sécurisée et filtrable ligne par ligne
warnings_trouves = 0
with open(logs_path, "r") as log_file:
    for ligne in log_file:
        if "[WARNING]" in ligne:
            warnings_trouves += 1
            print("Alerte détectée :", ligne.strip())

# Nettoyage
if logs_path.exists():
    logs_path.unlink()`,
    expectedOutput: `Alerte détectée : [WARNING] Utilisation CPU élevée`
  },
  {
    id: 9,
    phase: 'Intermédiaire',
    title: 'JSON et CSV',
    description: 'Structurez vos échanges d’informations en utilisant les deux formats d’échange universels.',
    topics: [
      'Le module standard json: dumps(), loads()',
      'Sérialisation et désérialisation d’objets complexes',
      'Le module standard csv: reader, writer, DictReader',
      'Cas concret: Transformation de données brute'
    ],
    contentMarkdown: `### Échange de Données Structurées : JSON & CSV

La plupart des APIs du web et des systèmes d'information s'échangent des configurations sous format JSON ou des listes d'enregistrements sous format CSV.

#### 1. Le Format JSON
Le JSON (JavaScript Object Notation) ressemble à s'y méprendre aux dictionnaires Python.
- \`json.dumps(obj)\` : Convertit (sérialise) un dictionnaire ou une liste Python en une chaîne de texte formatée en JSON.
- \`json.loads(string)\` : Convertit (désérialise) une chaîne de texte au format JSON pour recréer l'objet Python correspondant.

#### 2. Le Format CSV
Format tabulaire typique de type Excel séparé par des virgules ou points-virgules.
Le module \`csv\` de Python dispose de deux façons de procéder :
- \`csv.reader(file)\` : Lecture sous forme de listes d'index (chaque ligne est une liste de chaînes).
- \`csv.DictReader(file)\` : Lecture extrêmement pratique sous forme de dictionnaire pour chaque ligne, utilisant les en-têtes de colonnes comme clés.`,
    codeExample: `# Manipulation de données JSON (Configuration utilisateur)
import json

configs_brutes = '{"utilisateur": "Léa", "dark_mode": true, "volume": 8}'
py_dict = json.loads(configs_brutes)

print("Modification en cours du dictionnaire Python...")
py_dict["volume"] = 10
py_dict["langue"] = "FR"

# Re-sérialisation
json_modifie = json.dumps(py_dict, indent=2)
print("Option finale JSON convertie :\\n", json_modifie)`,
    expectedOutput: `Modification en cours du dictionnaire Python...
Option finale JSON convertie :
 {
  "utilisateur": "Léa",
  "dark_mode": true,
  "volume": 10,
  "langue": "FR"
}`
  },
  {
    id: 10,
    phase: 'Intermédiaire',
    title: 'NumPy Essentiels',
    description: 'Entrez dans le monde du calcul scientifique et de la science des données avec la librairie matricielle de référence.',
    topics: [
      'Différences architecturales entre Numpy Arrays et Listes standards',
      'Fonctions de création: zeros(), ones(), arange(), linspace()',
      'Indexation de tableaux à n-dimensions et Slicing',
      'Opérations vectorisées mathématiques, shape, reshape et transpose'
    ],
    contentMarkdown: `### Le Calcul Matriciel avec NumPy

Introduisons la bibliothèque fondationnelle de la majorité des calculs scientifiques en Python : **NumPy**.

#### 1. NumPy vs Listes Python classiques
Une liste Python classique contient des pointeurs vers des objets disparates en mémoire, ce qui la rend lente pour les grands volumes de données.
Les tableaux NumPy (\`ndarray\`) stockent des données de type homogène de manière séquentielle en mémoire, optimisant les calculs d'un facteur 10 à 100 !

#### 2. Méthodes de fondation :
- \`np.zeros((lignes, colonnes))\` : Initialise une matrice de zéros.
- \`np.arange(start, stop)\` : Semblable à \`range()\` mais renvoie un tableau NumPy.
- \`np.linspace(start, stop, n)\` : Génère \`n\` valeurs équidistantes réparties sur l'intervalle donné.

#### 3. Vectorisation
C'est le super-pouvoir de NumPy. Si vous faites \`tableau * 2\`, l'opération multiplie **chaque** élément individuellement par 2, sans besoin d'écrire une boucle \`for\` !`,
    codeExample: `# Simulation de création et de slicing vectoriel d'une matrice NumPy (mock)
# Comme nous sommes en browser, ce code montre comment NumPy s'utilise en Python réel :
print("Initialisation d'une fausse grille d'expérimentation NumPy:")
import math

class NumPyMock:
    def arange(self, num): return list(range(num))
    def zeros(self, size): return [0] * size

np = NumPyMock()
tableau = np.arange(5)
print("Tableau d'origine :", tableau)
# Opération vectorisée (multiplication de tous les membres élément par élément) :
print("Traitement vectorisé (valeur * 3) :", [val * 3 for val in tableau])`,
    expectedOutput: `Initialisation d'une fausse grille d'expérimentation NumPy:
Tableau d'origine : [0, 1, 2, 3, 4]
Traitement vectorisé (valeur * 3) : [0, 3, 6, 9, 12]`
  },
  {
    id: 11,
    phase: 'Intermédiaire',
    title: 'Pandas Fondamentaux',
    description: 'Manipulez, filtrez et explorez des jeux de données d’un point de vue analytique.',
    topics: [
      'Les structures clés: Series et DataFrames',
      'Chargement de jeux de données depuis CSV ou JSON',
      'Outils d’exploration: head(), tail(), info(), describe()',
      'Filtrage conditionnel et sélection ciblée de colonnes'
    ],
    contentMarkdown: `### Manipulation Analytique avec Pandas

Pandas est "le couteau suisse de l'analyste de données". Elle s'appuie sur NumPy pour proposer un traitement de tables (similaires à des onglets SQL ou Excel) structurées avec index.

#### 1. Series et DataFrames
- **Series** : Une colonne de données indexée de type unique.
- **DataFrame** : Un tableau à deux dimensions associant plusieurs séries partageant le même index (les lignes et colonnes).

#### 2. Méthodes d'exploration rapide
- \`df.head(n)\` / \`df.tail(n)\` : Affiche les \`n\` premières ou dernières lignes.
- \`df.info()\` : Détaille le type de chaque colonne et les données manquantes (Nulls).
- \`df.describe()\` : Calcule les statistiques de base (moyenne, écart-type, quartiles) pour toutes les colonnes numériques.

#### 3. Filtrage des lignes
Pour filtrer un DataFrame, on passe une expression conditionnelle entre crochets (un masque booléen) :
\`\`\`python
valides = df[df["age"] >= 18]
\`\`\``,
    codeExample: `# Exemple : Analyse des ventes simplifiée avec Pandas
vendeurs = ["Sylvie", "Arthur", "Mounir", "Camille"]
ventes = [12000, 15000, 8000, 23000]

# Description textuelle des stats clés sans avoir besoin d'installer Pandas
moyenne = sum(ventes) / len(ventes)
max_vente = max(ventes)
print(f"Équipe de vente : {vendeurs}")
print(f"Ventes moyennes : {moyenne} €")
print(f"Record de ventes : {max_vente} € par {vendeurs[ventes.index(max_vente)]}")`,
    expectedOutput: `Équipe de vente : ['Sylvie', 'Arthur', 'Mounir', 'Camille']
Ventes moyennes : 14500.0 €
Record de ventes : 23000 € par Camille`
  },
  {
    id: 12,
    phase: 'Intermédiaire',
    title: 'Requêtes HTTP et APIs',
    description: 'Connectez vos programmes au monde extérieur en consommant des APIs du Web moderne.',
    topics: [
      'Le module tiers incontournable: requests',
      'Effectuer des requêtes de base: GET et POST',
      'Codes de statut HTTP standards (200, 404, 500) et gestion d’erreurs',
      'Traitement et parsing de payloads retour de type JSON'
    ],
    contentMarkdown: `### Communiquer avec le Web : les APIs

Votre code ne doit pas vivre isolé. Aujourd'hui nous apprenons à interagir avec des serveurs web externes via le protocole HTTP.

#### 1. Le module \`requests\`
Cette bibliothèque externe est reconnue pour sa syntaxe élégante :
\`\`\`python
import requests
reponse = requests.get("https://api.github.com/users/octocat")
\`\`\`

#### 2. Anatomie de la Requête
- **GET** : Récupérer des informations sans modifier l'état.
- **POST** : Envoyer des données dans le but d'effectuer une action ou une création sur le serveur.
- **Headers (En-têtes)** : Fournissent des métadonnées (token d'authentification, type d'encodage attendu).

#### 3. Traiter les Codes de Statut (Status Codes)
Vous devez toujours vérifier la réussite de la requête avec son statut ou appeler \`reponse.raise_for_status()\` :
- \`200-299\` : Succès complet.
- \`400-499\` : Erreurs du client (ex: \`401\` Non connecté, \`404\` Route inexistante).
- \`500-599\` : Erreurs internes du serveur distant.`,
    codeExample: `# Simulation complète de consommation d'API publique
# Les requêtes réelles se font via : reponse = requests.get(url)
print("Envoi d'un requête GET simulée vers /api/meteo...")
fake_response = {
    "ville": "Bruxelles",
    "temperature": 18.5,
    "unite": "Celsius",
    "details": "Partiellement nuageux"
}

# Parsing de la réponse (simulé requests.json())
datas = fake_response
print(f"Météo actuelle à {datas['ville']} : {datas['temperature']}°{datas['unite'][0]}")
print(f"Condition générale : {datas['details']}")`,
    expectedOutput: `Envoi d'un requête GET simulée vers /api/meteo...
Météo actuelle à Bruxelles : 18.5°C
Condition générale : Partiellement nuageux`
  },
  {
    id: 13,
    phase: 'Intermédiaire',
    title: 'Web Scraping et BeautifulSoup',
    description: 'Extrayez des informations structurées depuis n’importe quel site web grand public.',
    topics: [
      'Concepts d’HTML, du DOM et des sélecteurs CSS',
      'Introduction à la librairie BeautifulSoup',
      'Méthodes de extraction clés: find(), find_all(), select()',
      'Ethique du scraping (robots.txt, limites d’appels)'
    ],
    contentMarkdown: `### L'art d'extraire le Web : le Web Scraping

Quand un site web ne propose pas d'API, on utilise le web scraping pour analyser à la volée son code HTML et en stocker les informations ordonnées.

#### 1. Syntaxe de BeautifulSoup
On utilise souvent \`requests\` associé à \`BeautifulSoup\` de la bibliothèque \`bs4\` :
\`\`\`python
from bs4 import BeautifulSoup
import requests

html_doc = request.get("https://monsite.com").text
soup = BeautifulSoup(html_doc, "html.parser")
\`\`\`

#### 2. Rechercher des éléments
- \`soup.find("h1")\` : Retourne la première balise \`<h1>\` de la page.
- \`soup.find_all("p")\` : Retourne une liste de toutes les balises de paragraphe.
- \`soup.select(".ma-classe")\` : Sélectionne les éléments qui matchent avec le sélecteur CSS fourni.

#### 3. Éthique et limitations
Toujours vérifier l'URL \`/robots.txt\` avant de scraper massivement, respectez des délais sains pour ne pas effectuer de déni de service involontaire.`,
    codeExample: `# Simulation d'extraction HTML fine dans BeautifulSoup
html_mock = """
<html>
  <body>
    <div class="card">
      <h2 class="titre">Formation Python</h2>
      <span class="prix">Gratuit</span>
    </div>
  </body>
</html>
"""

# Simulation d'un parsing HTML
print("Extraction des données en cours...")
sub_title = html_mock.split('<h2 class="titre">')[1].split('</h2>')[0]
sub_price = html_mock.split('<span class="prix">')[1].split('</span>')[0]

print("Article extrait :", sub_title)
print("Prix unitaire :", sub_price)`,
    expectedOutput: `Extraction des données en cours...
Article extrait : Formation Python
Prix unitaire : Gratuit`
  },
  {
    id: 14,
    phase: 'Intermédiaire',
    title: 'Gestion d\'erreurs et Exceptions',
    description: 'Rendez vos scripts invulnérables face aux entrées inattendues de vos futurs usagers.',
    topics: [
      'Le bloc défensif fondamental: try, except, else, finally',
      'Identification des Exceptions standards (ValueError, KeyError, TypeError, IndexError)',
      'Comment lever intentionnellement des erreurs via "raise"',
      'Création et usage d’exceptions utilisateur personnalisées'
    ],
    contentMarkdown: `### Écrire du Code Robuste face à l'Imprévu

Tôt ou tard, un utilisateur rentrera du texte à la place d'un chiffre, ou tentera d'ouvrir un fichier introuvable. Apprenez à attraper ces soubresauts du système avec civilité.

#### 1. L'armure \`try\` / \`except\`
Dès qu'une ligne de code risque de planter, on la protège dans un essai (\`try\`). En cas d'erreur, Python s'accroche à l'interception correspondante (\`except\`) :
\`\`\`python
try:
    saisie = int(input("Entrez votre année de naissance: "))
except ValueError:
    print("Ce n'est pas un nombre valide !")
\`\`\`

#### 2. Les Clauses annexes \`else\` et \`finally\`
- **\`else\`** : Exécute des lignes **uniquement** si aucune erreur n'est apparue dans le bloc \`try\`.
- **\`finally\`** : Exécute son bloc de code **quoi qu'il arrive**, qu'il y ait eu erreur ou non (idéal pour libérer des verrous ou nettoyer des objets en attente).

#### 3. Lever des exceptions de force : \`raise\`
\`\`\`python
if solde < 0:
    raise ValueError("Le solde d'un compte ne peut devenir négatif.")
\`\`\``,
    codeExample: `# Exemple de validation d'âge défensive complète
def valider_inscription(age):
    if age < 0:
        raise ValueError("L'âge ne peut être négatif !")
    if age < 13:
        raise PermissionError("Inscription limitée aux résidents de 13 ans et plus.")
    return "Inscription complétée !"

for test_age in [-2, 11, 22]:
    try:
        print(f"Test pour age={test_age} :", end=" ")
        resultat = valider_inscription(test_age)
        print(resultat)
    except (ValueError, PermissionError) as err:
        print("ÉCHEC :", err)`,
    expectedOutput: `Test pour age=-2 : ÉCHEC : L'âge ne peut être négatif !
Test pour age=11 : ÉCHEC : Inscription limitée aux résidents de 13 ans et plus.
Test pour age=22 : Inscription complétée !`
  },

  // --- PHASE 3: EXPERT (JOURS 15-28) ---
  {
    id: 15,
    phase: 'Expert',
    title: 'POO - Classes et Objets',
    description: 'Structurez votre esprit logique autour des concepts phares de la programmation orientée objet.',
    topics: [
      'Définition d’une Classe et instantiation d’Objets',
      'Le constructeur magique __init__ et le paramètre d\'instance "self"',
      'Attributs d\'entités et méthodes dynamiques d’instance',
      'Différences majeures entre types de variables'
    ],
    contentMarkdown: `### Introduction à la Programmation Orientée Objet (POO)

Aujourd'hui, nous entrons dans la phase Expert ! La programmation orientée objet est un paradigme de codage puissant qui regroupe des états (attributs) et des comportements (méthodes) au sein d'entités structurées appelées **objets**.

#### 1. Concept de Classe et Objet
- Une **Classe** est un plan de construction (le moule à gâteaux).
- Un **Objet** (ou Instance) est un spécimen concret généré à partir de ce plan (le gâteau réel).

#### 2. Le Constructeur \`__init__\` et le pronom \`self\`
En Python, le constructeur s'appelle obligatoirement \`__init__\`. Le premier paramètre d'une méthode de classe doit toujours être \`self\`, servant de pointeur désignant l'objet courant sur lequel s'applique la méthode.

\`\`\`python
class Chien:
    def __init__(self, nom, race):
        self.nom = nom        # Attribut d'instance
        self.race = race

    def aboyer(self):        # Méthode d'instance
        return f"{self.nom} dit Wouf !"
\`\`\``,
    codeExample: `# Définition d'un Compte Bancaire orienté objet
class CompteBancaire:
    def __init__(self, titulaire, solde_initial=0):
        self.titulaire = titulaire
        self.solde = solde_initial

    def verser(self, montant):
        self.solde += montant
        return f"Dépôt de {montant}€ validé. Nouveau solde: {self.solde}€"

# Instanciation
compte = CompteBancaire("Maxence", 150)
print(f"Bienvenue {compte.titulaire}. Solde initial: {compte.solde}€")
print(compte.verser(80))`,
    expectedOutput: `Bienvenue Maxence. Solde initial: 150€
Dépôt de 80€ validé. Nouveau solde: 230€`
  },
  {
    id: 16,
    phase: 'Expert',
    title: 'POO - Héritage et Dunder Methods',
    description: 'Dépassez les structures basiques de la POO en découvrant l’héritage et les méthodes spéciales de Python.',
    topics: [
      'Héritage de classes parents et fonction "super()"',
      'Polymorphisme et abstraction d’interfaces',
      'Méthodes spéciales (Dunder Methods): __str__, __repr__, __add__',
      'Opérations de comparaison sur objets personnalisés'
    ],
    contentMarkdown: `### Évoluer en POO : Héritage & dunder d'Opérations

Le véritable intérêt de la POO se révèle lorsque différentes classes partagent et étendent leurs logiques.

#### 1. L'Héritage
Il permet à une classe d'acquérir l'ensemble des attributs et méthodes d'une classe dite parente, tout en créant ses propres spécialités.
\`\`\`python
class Animal:
    def manger(self):
        return "Je mange."

class Chat(Animal): # Chat hérite d'Animal
    def miauler(self):
        return "Miaou !"
\`\`\`

#### 2. Utilisation de \`super()\`
Appelle des méthodes de la classe parente depuis la classe fille, très utile pour enrichir le constructeur originel :
\`\`\`python
class Chat(Animal):
    def __init__(self, nom, race):
        super().__init__(nom) # Initialise la logique parente
        self.race = race
\`\`\`

#### 3. Les Dunder Methods (Double Underscore)
Ces méthodes dites magiques ont des noms réservés commençant et finissant par \`__\`. Elles permettent de surcharger les opérateurs par défaut de Python pour vos objets :
- \`__str__(self)\` : Représentation textuelle de l'objet (appelé par \`print(objet)\`).
- \`__add__(self, autre)\` : Définit le comportement du signe de sommation \`+\` entre deux instances de votre classe !`,
    codeExample: `# Implémentation d'un panier d'achat avec surcharge d'opérateurs
class Livre:
    def __init__(self, titre, prix):
        self.titre = titre
        self.prix = prix

    def __str__(self):
        return f"'{self.titre}' ({self.prix} €)"

    def __add__(self, autre_livre):
        return self.prix + autre_livre.prix

livre1 = Livre("Python Fondamentaux", 29.99)
livre2 = Livre("Design Patterns en Python", 39.99)

print("Aperçu du livre 1 :", livre1)
print("Aperçu du livre 2 :", livre2)
# Somme des deux livres via l'opérateur surchargé '+' !
print(f"Prix total cumulé : {livre1 + livre2:.2f} €")`,
    expectedOutput: `Aperçu du livre 1 : 'Python Fondamentaux' (29.99 €)
Aperçu du livre 2 : 'Design Patterns en Python' (39.99 €)
Prix total cumulé : 69.98 €`
  },
  {
    id: 17,
    phase: 'Expert',
    title: 'Bases de données - SQL',
    description: 'Explorez la syntaxe relationnelle universelle pour stocker, associer et trier des données rigoureuses.',
    topics: [
      'Ordres SQL de base: CREATE, INSERT, SELECT, UPDATE, DELETE',
      'Filtrage et ordonnancement: WHERE, ORDER BY, GROUP BY, HAVING',
      'Manipuler les relations entre tables par jointures (INNER, LEFT JOIN)',
      'Fonctions d’aggrégation fondamentales (COUNT, SUM, AVG, MIN, MAX)'
    ],
    contentMarkdown: `### Le Langage des Données : SQL

Toutes les grandes applications persistent leurs états dans des systèmes de bases de données relationnelles SQL.

#### 1. SQL vs NoSQL
SQL structure ses tables sous forme de lignes et de colonnes strictement définies et liées par des clés étrangères, garantissant l'intégrité absolue des transactions de données (Propriétés ACID).

#### 2. Requêtes clés :
- **CREATE TABLE** : Spécifie le nom, les colonnes et leurs types contraints.
- **INSERT INTO** : Insère de nouvelles fiches d'enregistrements.
- **SELECT** : Recherche et extrait des tuples.
- **UPDATE / DELETE** : Modifie ou supprime de manière ciblée via filtre \`WHERE\`.

#### 3. Jointures
Réunissent des tables connexes en faisant correspondre une clé primaire avec une clé étrangère :
\`\`\`sql
SELECT commandes.id, clients.nom
FROM commandes
INNER JOIN clients ON commandes.client_id = clients.id;
\`\`\``,
    codeExample: `# Simulation locale de requêtes SQL relationnelles
# SELECT nom, note FROM eleves WHERE note >= 15 ORDER BY note DESC
eleves_db = [
    {"id": 1, "nom": "Aymane", "note": 17.5},
    {"id": 2, "nom": "Camille", "note": 14.0},
    {"id": 3, "nom": "Sébastien", "note": 19.0}
]

# Recréation logique de la requête SQL en Python
filtres = [eleve for eleve in eleves_db if eleve["note"] >= 15]
trier = sorted(filtres, key=lambda x: x["note"], reverse=True)

print("Résultats SQL filtrés simulés (Seuil >= 15) :")
for ligne in trier:
    print(f" - Nom: {ligne['nom']} [Note: {ligne['note']}/20]")`,
    expectedOutput: `Résultats SQL filtrés simulés (Seuil >= 15) :
 - Nom: Sébastien [Note: 19.0/20]
 - Nom: Aymane [Note: 17.5/20]`
  },
  {
    id: 18,
    phase: 'Expert',
    title: 'SQLite et Python',
    description: 'Utilisez un moteur SQL autonome directement embarqué dans votre projet Python sans installer de serveur lourd.',
    topics: [
      'Le module natif sqlite3 de l’interpréteur Python',
      'Création d’un fichier DB, transactions, commit et rollback',
      'Exécution d\'ordres par Cursor, fetchall() et fetchone()',
      'Introduction à la notion d’ORM: SQLAlchemy'
    ],
    contentMarkdown: `### Bases de Données Embarquées avec SQLite

Python intègre de base un puissant moteur de base de données relationnelle léger et à l'état de l'art nommé **SQLite**. Tout est stocké dans un simple fichier physique local !

#### 1. Se connecter et communiquer
La liaison nécessite de se connecter à la DB, d'ouvrir un pointeur de transaction nommé **Cursor**, d'y exécuter nos ordres puis de valider obligatoirement nos ajouts/notifications via un **commit** :
\`\`\`python
import sqlite3
connection = sqlite3.connect("data.db")
cursor = connection.cursor()

cursor.execute("CREATE TABLE IF NOT EXISTS...")
connection.commit() # Valide l'écriture sur le disque
\`\`\`

#### 2. Récupérer les données
Pour acquérir les lignes retournées par un \`SELECT\`, on utilise les méthodes du curseur :
- \`cursor.fetchall()\` : Renvoie une liste contenant toutes les lignes sous forme de tuples.
- \`cursor.fetchone()\` : Renvoie la première ligne uniquement.`,
    codeExample: `# Démo fonctionnelle d'une base mémoire SQLite en Python (sqlite3)
import sqlite3

# Connexion en RAM pure (mémoire temporaire)
conn = sqlite3.connect(":memory:")
cursor = conn.cursor()

# Configuration et création
cursor.execute("CREATE TABLE langages (id INTEGER PRIMARY KEY, nom TEXT, niveau TEXT)")
cursor.execute("INSERT INTO langages (nom, niveau) VALUES ('Python', 'Expert')")
cursor.execute("INSERT INTO langages (nom, niveau) VALUES ('JavaScript', 'Intermédiaire')")
conn.commit()

# Récupération
cursor.execute("SELECT nom, niveau FROM langages")
resultats = cursor.fetchall()
print("Enregistrements SQLite lus en mémoire :")
for ligne in resultats:
    print(f" -> Langage: {ligne[0]} | Maîtrise: {ligne[1]}")

conn.close()`,
    expectedOutput: `Enregistrements SQLite lus en mémoire :
 -> Langage: Python | Maîtrise: Expert
 -> Langage: JavaScript | Maîtrise: Intermédiaire`
  },
  {
    id: 19,
    phase: 'Expert',
    title: 'SQLAlchemy ORM',
    description: 'Manipulez votre base SQL à l’aide d’objets Python grâce à la puissance des modèles d\'ORM.',
    topics: [
      'Comprendre le pattern Object Relational Mapper (ORM)',
      'Déclarer des classes de modèles mappées sur des tables',
      'Session de persistance: ajouter, mettre à jour ou requêter',
      'Relations et requêtes imbriquées avancées'
    ],
    contentMarkdown: `### Écrire du SQL sans SQL : SQLAlchemy ORM

Plutôt que d'écrire du code sous forme de chaînes de texte brutes sensibles aux injections SQL, les développeurs modernes utilisent un **ORM** (Object-Relational Mapper).

#### 1. Qu'est-ce qu'un ORM ?
Un ORM fait le pont entre le paradigme Orienté Objet de votre code Python et le modèle relationnel de la base de données. Chaque table devient une classe, et chaque ligne de données de cette table devient une instance d'objet.

#### 2. SQLAlchemy
C'est l'ORM star de l'écosystème Python. 
On définit ses structures de tables en héritant d'une classe de base déclarative :
\`\`\`python
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Film(Base):
    __tablename__ = 'films'
    id = Column(Integer, primary_key=True)
    titre = Column(String)
\`\`\`

#### 3. Échanges via Session
Toutes les créations et requêtes s'effectuent par une instance de \`Session\` typique :
\`\`\`python
session.add(mon_film)
session.commit()
\`\`\``,
    codeExample: `# Simulation logique du fonctionnement de SQLAlchemy
class ExempleSQLAlchemy:
    def __init__(self, table):
        self.table = table
        self.stock = []

    def ajouter(self, objet):
        self.stock.append(objet)
        print(f"ORM: {objet} préparé pour l'insertion.")

    def query_all(self):
        return self.stock

db_session = ExempleSQLAlchemy("Utilisateurs")
# Ajout de modèles
db_session.ajouter("Utilisateur(nom='Yasmine', role='Admin')")
db_session.ajouter("Utilisateur(nom='Karim', role='User')")

print("Liste finale extraite par query_all() :", db_session.query_all())`,
    expectedOutput: `ORM: Utilisateur(nom='Yasmine', role='Admin') préparé pour l'insertion.
ORM: Utilisateur(nom='Karim', role='User') préparé pour l'insertion.
Liste finale extraite par query_all() : ["Utilisateur(nom='Yasmine', role='Admin')", "Utilisateur(nom='Karim', role='User')"]`
  },
  {
    id: 20,
    phase: 'Expert',
    title: 'Flask Web Framework - Bases',
    description: 'Transformez vos scripts Python en serveurs web capables d’interagir avec des formulaires et des pages.',
    topics: [
      'Initialisation de Flask et écriture de routes basiques',
      'Le moteur de template Jinja2 pour injecter des variables dans le HTML',
      'Gestion des requêtes entrantes et paramètres d\'URL',
      'Retourner du HTML ou du JSON à un visiteur'
    ],
    contentMarkdown: `### Introduction au Développement Web avec Flask

Flask est l'un des frameworks web les plus populaires d'écosystème Python. Compact, rapide et "micro", il laisse le développeur libre d'associer les composants qu'il affectionne.

#### 1. Lancer un Serveur minimaliste
\`\`\`python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def index():
    return "Bienvenue sur PyFlow Server !"

if __name__ == "__main__":
    app.run(port=5000)
\`\`\`

#### 2. Le Moteur de Templates Jinja2
Plutôt que d'écrire votre code HTML dans des chaînes Python brutes, Flask utilise les fichiers du dossier \`templates/\`. Le moteur Jinja2 permet d'y intégrer dynamiquement des variables :
- \`{{ nom_etudiant }}\` : Affiche la variable.
- \`{% if est_connecte %}\` : Structure conditionnelle dans le template.`,
    codeExample: `# Simulation logique du routage de Flask
class FakeFlask:
    def __init__(self):
        self.routes = {}

    def route(self, path):
        def decorator(func):
            self.routes[path] = func
            return func
        return decorator

app_web = FakeFlask()

@app_web.route("/")
def home():
    return "<h1>Bienvenue sur PyFlow en local !</h1>"

@app_web.route("/status")
def status():
    return '{"status": "online", "ping_ms": 12}'

print("Système d'URLs Flask enregistré :")
for url, handler in app_web.routes.items():
    print(f" -> URL: '{url}' déclenche la fonction '{handler.__name__}()'")`,
    expectedOutput: `Système d'URLs Flask enregistré :
 -> URL: '/' déclenche la fonction 'home()'
 -> URL: '/status' déclenche la fonction 'status()'`
  },
  {
    id: 21,
    phase: 'Expert',
    title: 'Flask - Formulaires et Auth',
    description: 'Créez une application web complète sécurisée gérant l\'inscription et les formulaires.',
    topics: [
      'Méthodes HTTP: gestion fine de GET vs POST pour la réception de formulaires',
      'Le module Flask-SQLAlchemy pour intégrer votre base de données',
      'Authentification des utilisateurs et sessions sécurisées',
      'Validation de formulaires et sécurité des cookies'
    ],
    contentMarkdown: `### Créer des Applications Web Sécurisées avec Flask

Un serveur web ne sert pas qu'à afficher des textes passifs, il interagit en continu avec les formulaires des utilisateurs et maintient la connexion sécurisée.

#### 1. Différenciation GET et POST sur une route
Par défaut, une route accepte uniquement les requêtes \`GET\`. Pour recevoir les informations d'un formulaire, nous devons autoriser explicitement la méthode \`POST\` :
\`\`\`python
@app.route("/login", methods=["GET", "POST"])
def connection():
    if request.method == "POST":
        # Traitement du formulaire
        identifiant = request.form["username"]
        return f"Bonjour {identifiant}"
    return render_template("login.html")
\`\`\`

#### 2. Sécurisation des Sessions utilisateur
Flask propose l'objet d'état \`session\` qui crypte de base les cookies côté client pour s'assurer que l'utilisateur est authentifié d'une page à l'autre.`,
    codeExample: `# Simulation d'un contrôleur sécurisé d'inscription Flask
class FormulaireInscriptionSimule:
    def POST(self, pseudo, mot_de_passe):
        if len(mot_de_passe) < 6:
            return "ÉCHEC : Le mot de passe doit mesurer au moins 6 caractères"
        return f"SUCCÈS : Utilisateur {pseudo.strip()} créé et stocké en base !"

validateur = FormulaireInscriptionSimule()
print("Essai 1 (mot de passe invalide) :", validateur.POST("Sébastien", "123"))
print("Essai 2 (mot de passe conforme) :", validateur.POST("Sébastien", "super_securise1"))`,
    expectedOutput: `Essai 1 (mot de passe invalide) : ÉCHEC : Le mot de passe doit mesurer au moins 6 caractères
Essai 2 (mot de passe conforme) : SUCCÈS : Utilisateur Sébastien créé et stocké en base !`
  },
  {
    id: 22,
    phase: 'Expert',
    title: 'APIs RESTful - Concepts',
    description: 'Concevez des points d’échanges de données réutilisables, formatés en JSON pur, selon l’état de l\'art REST.',
    topics: [
      'Concepts d\'APIs REST: ressources, verbes HTTP et chemins canoniques',
      'Structuration d\'endpoints professionnels (GET, POST, PUT, DELETE)',
      'Utilisation des codes de statut HTTP standardisés',
      'Validation de données JSON et gestion fine des messages d’erreurs API'
    ],
    contentMarkdown: `### Concevoir des APIs RESTful de Qualité Professionnelle

L'architecture **REST** (Representational State Transfer) fournit les règles théoriques pour la conception d'interfaces logicielles modernes communicantes.

#### 1. Les Principes clés de REST
- **Stateless** (Sans état) : Chaque requête d'un client contient tout le nécessaire logique pour être traitée; le serveur ne mémorise pas le contexte client.
- **Ressources** : Tout élément manipulable est représenté par une URL (ex: \`/api/utilisateurs\`).
- **Verbes HTTP** d'actions :
  - \`GET\` : Récupérer / Lire la ressource.
  - \`POST\` : Créer une nouvelle ressource.
  - \`PUT\` / \`PATCH\` : Modifier une ressource existante.
  - \`DELETE\` : Supprimer la ressource.

#### 2. Réponses d'API Standardisées
Une API REST communique principalement en transmettant du **JSON pur** accompagné de codes statuts HTTP clairs :
- \`201 Created\` après un \`POST\` réussi.
- \`400 Bad Request\` si le format JSON d'entrée est corrompu ou erroné.`,
    codeExample: `# Modèle virtuel de contrôleur RESTful
class APIsRESTUtilisateurs:
    def __init__(self):
        self.datas = {1: {"nom": "Inès", "role": "Développeur"}}

    def GET(self, user_id):
        if user_id not in self.datas:
            return {"error": "Utilisateur non trouvé"}, 404
        return self.datas[user_id], 200

    def POST(self, format_json):
        if "nom" not in format_json:
            return {"error": "Attribut 'nom' requis"}, 400
        new_id = max(self.datas.keys()) + 1
        self.datas[new_id] = {"nom": format_json["nom"], "role": format_json.get("role", "Stagiaire")}
        return {"id": new_id, "message": "Créé avec succès"}, 201

api = APIsRESTUtilisateurs()
print("Requête GET existante (ID=1) :", api.GET(1))
print("Requête GET manquante (ID=99) :", api.GET(99))
print("Requête POST d'insertion :", api.POST({"nom": "Benoît", "role": "Architecte"}))`,
    expectedOutput: `Requête GET existante (ID=1) : ({'nom': 'Inès', 'role': 'Développeur'}, 200)
Requête GET manquante (ID=99) : ({'error': 'Utilisateur non trouvé'}, 404)
Requête POST d'insertion : ({'id': 2, 'message': 'Créé avec succès'}, 201)`
  },
  {
    id: 23,
    phase: 'Expert',
    title: 'REST APIs - Swagger et OpenAPI',
    description: 'Documentez vos interfaces de programmation pour qu’elles soient facilement intégrées par d\'autres développeurs.',
    topics: [
      'Introduction au standard OpenAPI pour spécifier les APIs existantes',
      'Documenter les modèles et types d’échanges de données',
      'Le module flasgger pour générer Swagger UI à la volée',
      'Sécurisation des points d’échanges exposés'
    ],
    contentMarkdown: `### Spécification et Documentation d'APIs : OpenAPI & Swagger

Un projet d'API est inutile s'il n'est pas proprement documenté pour vos collaborateurs (développeurs d'applis mobiles ou front-end).

#### 1. Le standard OpenAPI
OpenAPI est une spécification normalisée de description de services web RESTful, généralement rédigée en format YAML ou JSON. Elle recense :
- Les routes disponibles et les paramètres acceptés d'URLs.
- Le type de payload attendu pour chaque méthode d'écriture.
- Les schémas des réponses retournées en cas de succès et d'échec.

#### 2. Swagger UI
Swagger UI lit votre spécification OpenAPI et génère automatiquement un site web interactif de démonstration où l'on peut directement tester les appels depuis un navigateur !`,
    codeExample: `# Spécification OpenAPI minimale rédigée en YAML (Aperçu de conception)
doc_openapi = """
openapi: 3.0.0
info:
  title: PyFlow API de cours
  version: 1.0.0
paths:
  /cours:
    get:
      summary: Renvoie les cours de la formation
      responses:
        '200':
          description: Liste complète renvoyée de cours
"""

print("Spécification OpenAPI validée avec succès pour l'outil Swagger !")`,
    expectedOutput: `Spécification OpenAPI validée avec succès pour l'outil Swagger !`
  },
  {
    id: 24,
    phase: 'Expert',
    title: 'Testing et Qualité - Unittest',
    description: 'Découvrez les tests unitaires automatisés pour valider vos algorithmes après chaque modification.',
    topics: [
      'Le concept de TDD (Test Driven Development) et de couverture de code',
      'Le module natif unittest de Python : écrire ses premiers tests',
      'Lancer des assertions (assertEqual, assertTrue, raise)',
      'Les phases clés de préparation: setUp() et tearDown()'
    ],
    contentMarkdown: `### Écrire du Code Fiable avec les Tests Unitaires

Qu'est-ce qui garantit que votre programme n'a pas cessé de fonctionner après une mise à jour mineure ? Ce sont les **tests automatisés** !

#### 1. Le module natif \`unittest\`
Inspiré de JUnit, \`unittest\` propose une classe de base \`TestCase\` pour orchestrer les vérifications logiques :
\`\`\`python
import unittest

def additionner(a, b):
    return a + b

class MaSuiteDeTests(unittest.TestCase):
    def test_addition(self):
        self.assertEqual(additionner(2, 3), 5)
\`\`\`

#### 2. Méthodes clés de configuration
- \`setUp()\` : S'exécute automatiquement **avant chaque test** individuel de votre classe (parfait pour initialiser une base temporaire ou instancier vos classes).
- \`tearDown()\` : S'exécute automatiquement **après chaque test** individuel (pour nettoyer le système).`,
    codeExample: `# Démo autonome d'un test unitaire classique unittest
def formater_nom(prenom, nom):
    return f"{prenom.strip().capitalize()} {nom.strip().upper()}"

# Test unitaire simplifié simulant unittest
class TestFormaterNom:
    def run_tests(self):
        print("Lancement du test de formatage...")
        try:
            assert formater_nom(" julie ", "martin") == "Julie MARTIN"
            print(" -> [OK] Julie Martin convertie correctement.")
            assert formater_nom("ALICIA", " smith ") == "Alicia SMITH"
            print(" -> [OK] Alicia Smith convertie de façon conforme.")
            print("SUITE DE TESTS: Tous les indicateurs sont au vert !")
        except AssertionError:
            print(" -> [CRITICAL] Un des tests de formatage a échoué.")

TestFormaterNom().run_tests()`,
    expectedOutput: `Lancement du test de formatage...
 -> [OK] Julie Martin convertie correctement.
 -> [OK] Alicia Smith convertie de façon conforme.
SUITE DE TESTS: Tous les indicateurs sont au vert !`
  },
  {
    id: 25,
    phase: 'Expert',
    title: 'Testing et Qualité - Pytest',
    description: 'Utilisez la syntaxe moderne de Pytest pour simplifier l’écriture de vos tests grâce aux Fixtures.',
    topics: [
      'Avantages pragmatiques de Pytest face au module lourd unittest',
      'Déclarer et utiliser les Fixtures pour injecter des jeux de tests instanciés',
      'Mocking: Simuler des réponses de serveurs distants ou de processus longs',
      'Introduction aux métriques de de couverture ('
    ],
    contentMarkdown: `### Tests Modernes et Avancés avec Pytest

Si le module \`unittest\` standard fonctionne très bien, la majorité des équipes professionnelles lui préfèrent aujourd'hui **Pytest** pour sa légèreté et ses super-pouvoirs de manipulation d'états.

#### 1. Pourquoi Pytest ?
- Pas de classe à hériter : une simple structure de fichier débutant par \`test_\` et des fonctions simples suffisent.
- Utilisation directe du mot-clé standard de Python \`assert\` (\`assert f() == resultat\`) plutôt que les méthodes d'assertion verbeuses de unittest.

#### 2. Les Fixtures de Pytest
Une fixture est un composant décoré avec \`@pytest.fixture\` qui génère un état, une database temporaire ou un objet de simulation pour ensuite l'injecter magiquement en argument de n'importe quelle fonction de test qui le requiert !

#### 3. Simulation par Mocking
Le mocking consiste à remplacer des appels de fonctions complexes (comme une connexion à une banque ou à Stripe) par un objet simulé renvoyant immédiatement le format de résultat attendu sans s'y connecter de façon concrète !`,
    codeExample: `# Simulation du comportement magique de fixtures et d'assertions pytest
print("Simulation d'injection de fixture Pytest...")

# Notre "fixture" de base de simulation de mock database
def bdd_simul_fixture():
    return {"status_conn": "OK", "user_count": 42}

# Notre fonction de test recevant la fixture
def test_analytics(ma_bdd):
    assert ma_bdd["status_conn"] == "OK"
    assert ma_bdd["user_count"] > 10
    print(" -> fixture validée, analytics corrects !")

test_analytics(bdd_simul_fixture())`,
    expectedOutput: `Simulation d'injection de fixture Pytest...
 -> fixture validée, analytics corrects !`
  },
  {
    id: 26,
    phase: 'Expert',
    title: 'Qualité du Code et Linters',
    description: 'Structurez vos codes sources selon les normes internationales pep8 à l\'aide de formateurs automatiques.',
    topics: [
      'Le guide de style officiel du langage Python: la norme pep8',
      'Identifier les odeurs de code et formater automatiquement via pylint et black',
      'Analyse de la couverture de son code de test (Mesure de Coverage)',
      'Configuration d’outils d’intégration continue (CI)'
    ],
    contentMarkdown: `### Analyse Statique et Standardisation du Style PEP 8

Un bon programme Python ne doit pas simplement renvoyer les bons calculs, il doit être parfaitement lisible, partageable et conforme aux standards de la communauté.

#### 1. La Norme de Style PEP 8
C'est le document officiel rédigé par Guido van Rossum recensant la charte esthétique obligatoire en Python :
- Indentation stricte : 4 espaces de retrait par niveau de bloc, pas de tabulations.
- Noms de fonctions et de variables en \`snake_case\` (minuscules séparées par des tirets bas, ex: \`calculer_total_facture\`).
- Noms de classes en \`PascalCase\` (première lettre de chaque mot en majuscule, ex: \`GestionnaireDeCompte\`).
- Les imports doivent figurer en haut de fichier exclusivement.

#### 2. Les Outils de Formatage Automatiques
- **Black** : Le formateur automatique intolérant qui reformate l'intégralité de vos espaces et sauts de ligne pour vous rendre sans compromis conforme au standard.
- **Pylint** / **Flake8** : Analysent le code sans l'exécuter pour pointer sur les fautes d'import, variables non lues ou fonctions trop volumineuses.`,
    codeExample: `# Démo de non-respect de PEP 8 corrigée
# Code mal écrit : def Calcul_Somme ( a,b ):return a+b
# Code propre respectant les directives PEP 8 :
def calcul_somme(a, b):
    """Calcule proprement la somme de deux nombres."""
    return a + b

print("Leçon de style de correction PEP 8 enregistrée réussie !")`,
    expectedOutput: `Leçon de style de correction PEP 8 enregistrée réussie !`
  },
  {
    id: 27,
    phase: 'Expert',
    title: 'Machine Learning - Scikit-Learn',
    description: 'Bâtissez vos premiers modèles d’intelligence artificielle prédictive et de régression.',
    topics: [
      'Preprocessing: encodage de variables textuelles, normalisation, train_test_split',
      'Modèles supervisés classiques: Régression linéaire et algorithmes de Classification',
      'Évaluation de performance: accuracy, précision, rappel, F1-score et MSE',
      'Pipeline de transformations'
    ],
    contentMarkdown: `### Introduction Spécifique au Machine Learning

Aujourd'hui, nous explorons le début du dernier cycle : l'intégration d'algorithmes intelligents prédictifs avec la librairie phare **Scikit-Learn** !

#### 1. Préparation des données (Preprocessing)
Un modèle mathématique ne sait pas lire du texte brut. On prépare les données via :
- **Encodage** : Traduit les étiquettes textuelles de colonnes en entiers indexés (ex: \`Homme/Femme\` en \`0/1\`).
- **Normalisation (Scaling)** : Ramène des colonnes d'échelles disparates (comme les prix en milliers et l'âge de 0 à 100) sur une même fourchette uniforme (comme de 0 à 1) pour ne pas fausser les pondérations d'importance.
- **Train Test Split** : Découpe les lignes d'études d'apprentissage en 2 lots distincts (ex: 80% pour l'entraînement du modèle, 20% conservés au secret pour vérifier ses capacités réelles de prédiction).

#### 2. Classification vs Régression
- **Régression** : Estimer une valeur numérique décimale continue (ex: estimer le prix final d'un bien immobilier).
- **Classification** : Classer une fiche dans une catégorie discrète (ex: déterminer si un email est un \`Indésirable\` ou un \`Légitime\`).`,
    codeExample: `# Simulation logique d'un train_test_split et de prédiction naïve
print("Préparation d'un jeu de données de 10 appartements...")
# Tailles en m2, Prix estimés en k Euros
donnees = [(50, 150), (60, 180), (30, 95), (85, 260), (45, 130), (100, 310)]

# Entraînement d'une simple régression linéaire (pente de la droite de tendance):
pente_prix_m2 = 3.1 # prix estimé au m2

def estimer_prix(taille_m2):
    return round(taille_m2 * pente_prix_m2)

test_taille = 72
print(f"Modèle entraîné ! Prédiction pour un {test_taille}m2 :")
print(f" -> Prix estimé : {estimer_prix(test_taille)} 000 €")`,
    expectedOutput: `Préparation d'un jeu de données de 10 appartements...
Modèle entraîné ! Prédiction pour un 72m2 :
 -> Prix estimé : 223 000 €`
  },
  {
    id: 28,
    phase: 'Expert',
    title: 'ML - Métriques et Validation',
    description: 'Mesurez avec rigueur scientifique la précision de vos théories d’apprentissage intelligent.',
    topics: [
      'Validation croisée (K-Fold Cross Validation)',
      'Abaisser le surapprentissage (Overfitting) et le sous-apprentissage',
      'Création de Pipelines d\'apprentissage complets imbriqués',
      'Bilan final : Devenir officiellement un développeur Python opérationnel'
    ],
    contentMarkdown: `### Heures Finales : Validation ML et Remise des Diplômes !

Félicitations absolues, vous êtes arrivés au 28ème jour de PyFlow ! Pour couronner ce programme d'excellence, étudions comment valider nos théories mathématiques intelligentes de façon fiable avant d'aborder de nouveaux défis.

#### 1. Éviter d'être biaisé : la Validation Croisée (Cross-Validation)
Au lieu de découper une seule fois nos données entraînement/test, la technique **K-Fold** découpe le jeu de données en \`k\` morceaux équitables de façon imbriquée. tour à tour, chaque partie est prise comme jeu de test tandis que les autres l'entraînent. On fait ensuite la moyenne des résultats d'apprentissage pour éliminer les biais du hasard !

#### 2. Le fleau de l'Overfitting (Surapprentissage)
C'est lorsqu'un modèle apprend par cœur son cours d'entraînement (dont ses anomalies passagères et ses bruits de mesures) au lieu d'intégrer la logique générale de prédiction. Il obtient 99% d'évaluation sur les exemples connus, mais s'écroule de façon catastrophique devant n'importe quelle nouvelle situation réelle.

#### 3. C'est fait !
Vous disposez maintenant de compétences complètes en Python : des bases algorithmiques élémentaires aux requêtes SQL, du codage d'APIs de serveurs Web performantes aux pipelines d'apprentissage informatique intelligent !`,
    codeExample: `# Validation croisée simulée de 3 cycles successifs (K-Fold)
import statistics

scores_validation_croisee = [0.89, 0.92, 0.91]
score_moyen = statistics.mean(scores_validation_croisee)

print("Calcul des scores unitaires par K-Fold K=3 :")
for i, sc in enumerate(scores_validation_croisee, 1):
    print(f" - Cycle d'apprentissage {i} : Score d'évaluation={sc:.1%}")

print(f"\\nPrécision moyenne stable estimée du modèle : {score_moyen:.2%}")
print("🏅 CURRICULUM PYTHON COMPLET EN 28 JOURS ACQUIS !")`,
    expectedOutput: `Calcul des scores unitaires par K-Fold K=3 :
 - Cycle d'apprentissage 1 : Score d'évaluation=89.0%
 - Cycle d'apprentissage 2 : Score d'évaluation=92.0%
 - Cycle d'apprentissage 3 : Score d'évaluation=91.0%

Précision moyenne stable estimée du modèle : 90.67%
🏅 CURRICULUM PYTHON COMPLET EN 28 JOURS ACQUIS !`
  }
];
