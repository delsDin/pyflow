import { QuizQuestion, CodingChallenge } from '../types';
import { courseDays } from './curriculum';

// Handcrafted Quizzes
const manualQuizzes: QuizQuestion[] = [
  // --- JOUR 1 ---
  {
    id: 'quiz_1_1',
    dayId: 1,
    question: 'Quel symbole permet d’effectuer une division entière en Python (renvoyant la partie entière sans décimales) ?',
    options: ['/', '//', '%', '\\'],
    answerIndex: 1,
    explanation: 'L’opérateur "/" effectue une division classique (renvoie un float), tandis que "//" effectue la division entière.'
  },
  {
    id: 'quiz_1_2',
    dayId: 1,
    question: 'Quelle fonction permet de convertir une saisie texte "input()" en nombre entier ?',
    options: ['float()', 'int()', 'str()', 'convert()'],
    answerIndex: 1,
    explanation: 'int() convertit une chaîne de caractères ou un nombre décimal en entier (ex: int("42") -> 42).'
  },
  {
    id: 'quiz_1_3',
    dayId: 1,
    question: 'Quel est l’opérateur pour calculer la puissance d’un nombre en Python ?',
    options: ['^', '**', 'pow', '^^'],
    answerIndex: 1,
    explanation: 'En Python, l’opérateur de puissance est le double astérisque : ** (ex: 2 ** 3 donne 8).'
  },
  {
    id: 'quiz_1_4',
    dayId: 1,
    question: 'Qui est le concepteur créateur du langage Python ?',
    options: ['Dennis Ritchie', 'Guido van Rossum', 'Bjarne Stroustrup', 'James Gosling'],
    answerIndex: 1,
    explanation: 'Guido van Rossum a créé Python en 1989 aux Pays-Bas, en s’inspirant de la comédie des Monty Python.'
  },
  {
    id: 'quiz_1_5',
    dayId: 1,
    question: 'Quelle est la valeur de l’expression "3 * \'A\'" ?',
    options: ['"3A"', '"AAA"', 'Une erreur de type', '"A3"'],
    answerIndex: 1,
    explanation: 'Multiplier un entier par une chaîne de caractères duplique la chaîne ce nombre de fois.'
  },
  {
    id: 'quiz_1_6',
    dayId: 1,
    question: 'Qu’est-ce que l’acronyme PVM désigne en informatique ?',
    options: ['Python Version Manager', 'Python Virtual Machine', 'Project Vital Meta', 'Private Value Model'],
    answerIndex: 1,
    explanation: 'La Python Virtual Machine (PVM) interprète le Bytecode généré lors de la compilation intermédiaire.'
  },
  {
    id: 'quiz_1_7',
    dayId: 1,
    question: 'Dans quel but utilise-t-on le paramètre optionnel "sep" dans la fonction print() ?',
    options: ['Sélectionner le fichier de sortie', 'Définir le séparateur de caractères entre les arguments à afficher', 'Ajouter un saut de ligne automatique', 'Vérifier la validité des variables'],
    answerIndex: 1,
    explanation: 'Le paramètre "sep" définit le caractère inséré entre chaque élément imprimé par print().'
  },
  {
    id: 'quiz_1_8',
    dayId: 1,
    question: 'Quelle est l’émanation principale de la philosophie de Python, accessible via "import this" ?',
    options: ['Le Manifeste Agile', 'Le Zen de Python', 'Le Guide PEP 8', 'La documentation standard'],
    answerIndex: 1,
    explanation: 'Taper "import this" dans l’interpréteur affiche le Zen de Python, résumant ses principes de conception.'
  },

  // --- JOUR 2 ---
  {
    id: 'quiz_2_1',
    dayId: 2,
    question: 'Que renvoie l’expression logique : not (True and False) ?',
    options: ['True', 'False', 'None', 'Une erreur'],
    answerIndex: 0,
    explanation: '(True and False) s’évalue à False. Puis "not False" renvoie True.'
  },
  {
    id: 'quiz_2_2',
    dayId: 2,
    question: 'Quelle est la syntaxe correcte pour une condition multiple en Python ?',
    options: [
      'if x > 10 { print() } else if x > 5 { print() }',
      'if x > 10: print() elif x > 5: print() else: print()',
      'if x > 10 then print() elsif x > 5 then print()',
      'if x > 10: print() else if x > 5: print()'
    ],
    answerIndex: 1,
    explanation: 'En Python, on utilise des ":" et le mot-clé "elif" à la place de "else if".'
  },
  {
    id: 'quiz_2_3',
    dayId: 2,
    question: 'Comment valide-t-on si une valeur x se trouve dans une liste L ?',
    options: ['x in L', 'L.contains(x)', 'x.inside(L)', 'find(x, L)'],
    answerIndex: 0,
    explanation: 'Le mot-clé "in" est utilisé pour vérifier l’appartenance d’un élément à une séquence.'
  },
  {
    id: 'quiz_2_4',
    dayId: 2,
    question: 'Que retourne la fonction bool(0) en Python ?',
    options: ['True', 'False', 'None', '0'],
    answerIndex: 1,
    explanation: 'Le nombre entier 0, ainsi que les collections vides, s’évaluent à False en contexte booléen.'
  },
  {
    id: 'quiz_2_5',
    dayId: 2,
    question: 'Qu’est-ce qui délimite un bloc de code (comme le corps d’une condition) en Python ?',
    options: ['Les accolades {}', 'Les parenthèses ()', 'L’indentation (les espaces de début de ligne)', 'Des points-virgules'],
    answerIndex: 2,
    explanation: 'Python utilise l’indentation obligatoire pour structurer et délimiter les blocs de code.'
  },
  {
    id: 'quiz_2_6',
    dayId: 2,
    question: 'Quel est l’opérateur logique pour le "OU" inclusif en Python ?',
    options: ['||', 'or', 'OR', '|'],
    answerIndex: 1,
    explanation: 'Python utilise le mot-clé textuel en minuscules "or" pour l’opérateur logique OU.'
  },
  {
    id: 'quiz_2_7',
    dayId: 2,
    question: 'Quel est l’opérateur logique pour le "ET" en Python ?',
    options: ['&&', 'and', 'AND', '&'],
    answerIndex: 1,
    explanation: 'Python utilise le mot-clé textuel en minuscules "and" pour l’opérateur logique ET.'
  },
  {
    id: 'quiz_2_8',
    dayId: 2,
    question: 'Quelle est la valeur de l’expression logique : 5 >= 5 ?',
    options: ['True', 'False', 'None', 'Une exception d’égalité'],
    answerIndex: 0,
    explanation: 'L’opérateur >= vérifie si le membre de gauche est supérieur OU égal à celui de droite. 5 étant égal à 5, l’expression est True.'
  },

  // --- JOUR 3 ---
  {
    id: 'quiz_3_1',
    dayId: 3,
    question: 'Que renvoie l’expression list(range(1, 10, 2)) ?',
    options: [
      '[1, 2, 3, 4, 5, 6, 7, 8, 9]',
      '[1, 3, 5, 7, 9]',
      '[2, 4, 6, 8, 10]',
      '[1, 3, 5, 7, 9, 11]'
    ],
    answerIndex: 1,
    explanation: 'range(start, stop, step) commence à 1, avance de 2 en 2, et s’arrête strictement avant 10.'
  },
  {
    id: 'quiz_3_2',
    dayId: 3,
    question: 'Quel mot-clé interrompt instantanément l’exécution globale d’une boucle ?',
    options: ['stop', 'exit', 'break', 'continue'],
    answerIndex: 2,
    explanation: '"break" sort immédiatement de la boucle contenant le mot-clé.'
  },
  {
    id: 'quiz_3_3',
    dayId: 3,
    question: 'Quel mot-clé suspend l’itération courante et saute immédiatement au début du tour suivant ?',
    options: ['next', 'skip', 'continue', 'pass'],
    answerIndex: 2,
    explanation: '"continue" arrête le tour de boucle en cours et passe directement à la prochaine itération.'
  },
  {
    id: 'quiz_3_4',
    dayId: 3,
    question: 'Que fait la boucle "for i in range(5):" ?',
    options: [
      'Elle boucle de 1 à 5 compris',
      'Elle boucle de 0 à 4 compris',
      'Elle produit une erreur à l’exécution',
      'Elle tourne indéfiniment'
    ],
    answerIndex: 1,
    explanation: 'range(5) génère les entiers de 0 à 4 (le 5 est exclu).'
  },
  {
    id: 'quiz_3_5',
    dayId: 3,
    question: 'Quand s’exécute le bloc "else" branché sur une boucle Python ?',
    options: [
      'Uniquement si la boucle s’est terminée naturellement sans interruption "break"',
      'Si la boucle rencontre un "break"',
      'Si une erreur d’itération se produit',
      'Il s’exécute avant le démarrage de la boucle'
    ],
    answerIndex: 0,
    explanation: 'Le bloc "else" associé à une boucle s’exécute uniquement si la boucle s’est terminée naturellement (pas de break rencontré).'
  },
  {
    id: 'quiz_3_6',
    dayId: 3,
    question: 'Quelle structure de boucle privilégie-t-on si le nombre de tours n’est pas planifiable à l’avance ?',
    options: ['for', 'while', 'repeat', 'loop'],
    answerIndex: 1,
    explanation: 'La boucle "while" évalue une condition dynamique, ce qui la rend idéale quand la fin dépend d’un événement indéterminé.'
  },
  {
    id: 'quiz_3_7',
    dayId: 3,
    question: 'Comment réaliser un compte à rebours de 3 à 1 compris avec range() ?',
    options: ['range(3, 1, -1)', 'range(3, 0, -1)', 'range(1, 4)', 'range(3, 0)'],
    answerIndex: 1,
    explanation: 'range(3, 0, -1) commence à 3, se déplace par pas négatif de -1, s’arrête juste avant 0 (donc à 1).'
  },
  {
    id: 'quiz_3_8',
    dayId: 3,
    question: 'Quel est le risque majeur d’une mauvaise boucle while ?',
    options: ['Un crash immédiat de compilation', 'Une boucle infinie qui fige le système', 'La perte automatique du code', 'Le typage dynamique fort'],
    answerIndex: 1,
    explanation: 'Si la condition d’une boucle while ne devient jamais fausse (False), le programme entre en boucle infinie.'
  }
];

// Handcrafted Challenges
const manualChallenges: CodingChallenge[] = [
  // --- JOUR 1 ---
  {
    id: 'challenge_1_1',
    dayId: 1,
    title: 'Variables et Calculatrice d’Aire',
    description: 'Créez un script qui calcule l’aire d’un rectangle et le coût du revêtement.',
    instructions: [
      'Déclarez une variable "largeur" ayant pour valeur 5',
      'Déclarez une variable "longueur" ayant pour valeur 12',
      'Calculez l’aire du rectangle dans une variable "aire" (Largeur x Longueur)',
      'Déclarez un tarif au mètre carré "prix_m2" à 15.5',
      'Calculez le coût total dans "cout_total" (Aire x prix_m2)',
      'Affichez les résultats en utilisant des prints'
    ],
    initialCode: `# Écrivez votre code ci-dessous
largeur = 5
longueur = 12

# 1. Calculez l'aire


# 2. Calculez le cout_total


# 3. Affichez les valeurs avec print()
`,
    testCases: [
      {
        input: '',
        expectedOutput: '930',
        description: 'L’aire de 60 multipliée par 15.5 donne un coût total de 930.'
      }
    ],
    validationKeywords: ['aire', 'cout_total', 'print']
  },
  {
    id: 'challenge_1_2',
    dayId: 1,
    title: 'Message d’Accueil Personnalisé',
    description: 'Manipulez les variables et les f-strings pour saluer chaleureusement l’utilisateur.',
    instructions: [
      'Déclarez une variable "nom" égale à "Guido"',
      'Déclarez une variable qui stocke le message "Bienvenue, Guido !" sous forme de f-string dans la variable "message"',
      'Imprimez la variable "message"'
    ],
    initialCode: `# Saluons Guido
nom = "Guido"

# Déclarez et imprimez le message
`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Bienvenue, Guido !',
        description: 'Vérification du message formaté'
      }
    ],
    validationKeywords: ['message', 'print', 'Guido']
  },

  // --- JOUR 2 ---
  {
    id: 'challenge_2_1',
    dayId: 2,
    title: 'Contrôleur d’Accès Intelligent',
    description: 'Mettez en pratique vos conditions if/elif/else pour valider le statut de connexion d’un utilisateur.',
    instructions: [
      'Définissez les variables : "age = 17" et "carte_invitation = True"',
      'Écrivez un bloc conditionnel : si l’utilisateur a 18 ans ou plus, OU s’il a une carte d’invitation valide, affichez "Accès Autorisé"',
      'Sinon, affichez "Accès Refusé"'
    ],
    initialCode: `# Évaluez la logique d'admission
age = 17
carte_invitation = True

# Écrivez la structure conditionnelle ci-dessous
`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Accès Autorisé',
        description: 'L’accès doit être autorisé'
      }
    ],
    validationKeywords: ['if', 'print', 'Accès Autorisé']
  },
  {
    id: 'challenge_2_2',
    dayId: 2,
    title: 'Détecteur d’État Thermodynamique',
    description: 'En fonction d’une température donnée, déterminez l’état physique de l’eau.',
    instructions: [
      'Déclarez une variable "temperature = -5"',
      'Si la température est inférieure ou égale à 0, affichez "Glace"',
      'Si elle est supérieure ou égale à 100, affichez "Vapeur"',
      'Sinon, affichez "Liquide"'
    ],
    initialCode: `# État thermodynamique de l'eau
temperature = -5

# Évaluez la température
`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Glace',
        description: 'La température de -5 correspond à l’état de glace.'
      }
    ],
    validationKeywords: ['if', 'print', 'Glace']
  },

  // --- JOUR 3 ---
  {
    id: 'challenge_3_1',
    dayId: 3,
    title: 'Somme des Entiers Pairs',
    description: 'Calculez la somme des entiers pairs compris entre 1 et 10 inclus avec une boucle.',
    instructions: [
      'Déclarez une variable "somme = 0"',
      'Écrivez une boucle "for i in range(1, 11):"',
      'Dans la boucle, ajoutez la valeur à "somme" uniquement si elle est paire (i % 2 == 0)',
      'Imprimez le résultat final'
    ],
    initialCode: `# Cumul d'éléments pairs
somme = 0

# Rédigez votre boucle d'itération
`,
    testCases: [
      {
        input: '',
        expectedOutput: '30',
        description: 'La somme 2 + 4 + 6 + 8 + 10 vaut 30.'
      }
    ],
    validationKeywords: ['for', 'somme', 'range']
  },
  {
    id: 'challenge_3_2',
    dayId: 3,
    title: 'Validation de Connexion interactive',
    description: 'Utilisez une boucle while pour imiter l’attente d’un mot de passe réussi.',
    instructions: [
      'Déclarez une variable "essai" ayant pour valeur vide ""',
      'Créez une boucle while qui tourne tant que "essai" est différent de "secret"',
      'Dans le corps de la boucle, changez la valeur de "essai" à "secret" pour simuler une saisie réussie',
      'Après la boucle, affichez "Succès"'
    ],
    initialCode: `# Boucle de vérification
essai = ""

# Créez la bouclewhile et affichez le succès
`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Succès',
        description: 'Vérification de la déconnexion de la boucle'
      }
    ],
    validationKeywords: ['while', 'secret', 'Succès']
  }
];

/**
 * Programmatic Fallback Generator:
 * Generates beautiful, custom quiz questions and challenges for any day D (from 1 to 28)
 * to ensure that we ALWAYS have exactly 8 quizzes and 2 coding challenges per day!
 */
export function generateDayQuizzes(dayId: number): QuizQuestion[] {
  // Check if we have handcrafted quizzes for this day
  const existing = manualQuizzes.filter(q => q.dayId === dayId);
  if (existing.length >= 8) {
    return existing.slice(0, 8);
  }

  // Fallback programmatic quizzes tailored to the specific day's concepts or themes
  const day = courseDays.find(d => d.id === dayId) || courseDays[0];
  const topics = day.topics && day.topics.length > 0 ? day.topics : ['Concepts fondamentaux de programmation'];
  
  const generated: QuizQuestion[] = [...existing];
  let quizIndex = existing.length + 1;

  while (generated.length < 8) {
    const topic = topics[generated.length % topics.length];
    
    // Choose questions with nice variations
    let question = '';
    let options: string[] = [];
    let answerIndex = 0;
    let explanation = '';

    switch (generated.length) {
      case 0:
      case 1:
        question = `Concernant "${topic}", quelle affirmation décrit le mieux la pratique standard recommandée ?`;
        options = [
          'Ignorer totalement les standards car Python est trop souple.',
          'Respecter rigoureusement les préconisations officiellles d’écriture pour garder le code propre.',
          'N’employer ces concepts que dans des applications d’analyse de données.',
          'Toujours utiliser des variables globales pour simplifier les calculs.'
        ];
        answerIndex = 1;
        explanation = `Pour l'item "${topic}", l'approche préconisée en Python est de suivre les standards officiels pour garantir la lisibilité et la maintenabilité globale.`;
        break;
      case 2:
      case 3:
        question = `En abordant la notion de "${topic}", quel est le piège ou comportement inattendu qu’un débutant doit surveiller ?`;
        options = [
          'Le fait que Python utilise le typage dynamique fort qui empêche les conversions implicites douteuses.',
          'L’absence totale de performances de calcul de la machine virtuelle.',
          'La nécessité de compiler manuellement le code avant chaque démarrage de script.',
          'L’impossibilité d’intégrer des commentaires explicatifs.'
        ];
        answerIndex = 0;
        explanation = `Python est typé dynamiquement mais fortement : cela évite les bugs silencieux en générant des exceptions claires si les types sont incompatibles.`;
        break;
      case 4:
      case 5:
        question = `Sous quel angle technique ou organisationnel "${topic}" apporte-t-il le plus de valeur ajoutée ?`;
        options = [
          'Il permet de formater l’affichage graphique en mode console.',
          'Il résout l’automatisation des tâches complexes et accélère le développement applicatif.',
          'Il restreint l’utilisation de la RAM aux seules opérations de bas niveau.',
          'Il remplace la nécessité de documenter son code.'
        ];
        answerIndex = 1;
        explanation = `Ce mécanisme contribue grandement à moduler l'application pour la rendre réutilisable et évolutive.`;
        break;
      default:
        question = `Quel outil ou concept est indispensable pour manipuler correctement "${topic}" ?`;
        options = [
          'Le terminal système de bas niveau uniquement.',
          'L’interpréteur Python exécutant le script ou l’environnement de développement comme VS Code.',
          'Un serveur de base de données relationnel obligatoirement.',
          'Un convertisseur externe de type de fichiers.'
        ];
        answerIndex = 1;
        explanation = `Un inspecteur, un interpréteur interactif ou un éditeur comme VS Code équipé d'extensions comme Pylance est l'environnement idéal.`;
        break;
    }

    generated.push({
      id: `quiz_gen_${dayId}_${quizIndex++}`,
      dayId,
      question,
      options,
      answerIndex,
      explanation
    });
  }

  return generated;
}

export function generateDayChallenges(dayId: number): CodingChallenge[] {
  // Check if we have handcrafted challenges
  const existing = manualChallenges.filter(c => c.dayId === dayId);
  if (existing.length >= 2) {
    return existing.slice(0, 2);
  }

  const generated: CodingChallenge[] = [...existing];
  const day = courseDays.find(d => d.id === dayId) || courseDays[0];
  const title = day.title;

  let challengeIndex = existing.length + 1;

  while (generated.length < 2) {
    let customTitle = '';
    let desc = '';
    let instructions: string[] = [];
    let initialCode = '';
    let expectedOutput = '';
    let valKeywords: string[] = [];

    if (generated.length === 0) {
      customTitle = `Atelier Pratique A : ${title}`;
      desc = `Mettez en pratique vos compétences fondamentales en lien avec l'apprentissage du jour : "${title}".`;
      instructions = [
        'Déclarez une variable nommée "mon_activite" ayant pour valeur le texte "Python"',
        'Déclarez une variable numérique "score_cible" ayant la valeur 100',
        'Affichez un résultat reprenant ces variables sous la forme d’une f-string',
        'Assurez-vous d’imprimer cette ligne avec print()'
      ];
      initialCode = `# Atelier de contrôle conceptuel\n# 1. Déclarez vos variables complexes ci-dessous\n\n`;
      expectedOutput = 'Python';
      valKeywords = ['mon_activite', 'score_cible', 'print'];
    } else {
      customTitle = `Atelier de Code B : Approfondissement - ${title}`;
      desc = `Validez vos capacités techniques et logiques avancées sur le thème "${title}".`;
      instructions = [
        'Déclarez le montant de référence "valeur_etude" à la valeur 42',
        'Créez un bloc conditionnel if vérifiant si la valeur est supérieure à 40',
        'Si c’est le cas, affichez "Validation OK" à l’écran',
        'Sinon, affichez "Validation Échecs"'
      ];
      initialCode = `# Atelier pratique avancé\nvaleur_etude = 42\n\n# Analysez la variable et imprimez\n`;
      expectedOutput = 'Validation OK';
      valKeywords = ['if', 'valeur_etude', 'print', 'Validation OK'];
    }

    generated.push({
      id: `challenge_gen_${dayId}_${challengeIndex++}`,
      dayId,
      title: customTitle,
      description: desc,
      instructions,
      initialCode,
      testCases: [
        {
          input: '',
          expectedOutput,
          description: `Vérification de la réponse ou valeur retournée : ${expectedOutput}`
        }
      ],
      validationKeywords: valKeywords
    });
  }

  return generated;
}

// Assemble and export core global lists derived using the generators
export const quizQuestions: QuizQuestion[] = courseDays.reduce((acc, currentDay) => {
  return acc.concat(generateDayQuizzes(currentDay.id));
}, [] as QuizQuestion[]);

export const codingChallenges: CodingChallenge[] = courseDays.reduce((acc, currentDay) => {
  return acc.concat(generateDayChallenges(currentDay.id));
}, [] as CodingChallenge[]);
