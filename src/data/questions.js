const questions = {
  maths: [
    {
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      answer: '4',
    },
    { question: "Square root of 81?", options: ["7", "8", "9", "10"], answer: "9" },
    { question: "12 x 12 = ?", options: ["124", "144", "134", "154"], answer: "144" },
    { question: "What is 15% of 200?", options: ["25", "30", "35", "40"], answer: "30" },
    { question: "3^3 = ?", options: ["6", "9", "27", "81"], answer: "27" },
    { question: "Derivative of x^2?", options: ["2x", "x", "x^2", "1"], answer: "2x" },
    { question: "Area of circle?", options: ["πr^2", "2πr", "πd", "r^2"], answer: "πr^2" },
    { question: "What is 7x0?", options: ["0", "1", "7", "Cannot be determined"], answer: "0" },
    { question: "100/25 = ?", options: ["2", "3", "4", "5"], answer: "4" },
    { question: "Factorial of 4?", options: ["12", "24", "8", "16"], answer: "24" }
  ],
  science: [
    {
      question: 'What planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
      answer: 'Mars',
    },
    { question: "What is water?", options: ["H2O", "HCl", "O2", "HO2"], answer: "H2O" },
    { question: "Speed of light?", options: ["300000 km/s", "150000 km/s", "100000 km/s", "50000 km/s"], answer: "300000 km/s" },
    { question: "What gas do plants absorb?", options: ["Oxygen", "Hydrogen", "Carbon Dioxide", "Nitrogen"], answer: "Carbon Dioxide" },
    { question: "What is DNA?", options: ["Protein", "Enzyme", "Genetic Material", "Carbohydrate"], answer: "Genetic Material" },
    { question: "Who developed the theory of relativity?", options: ["Newton", "Einstein", "Tesla", "Edison"], answer: "Einstein" },
    { question: "Sun is a?", options: ["Planet", "Star", "Comet", "Asteroid"], answer: "Star" },
    { question: "Normal body temperature?", options: ["98.6°F", "99°F", "97°F", "100°F"], answer: "98.6°F" },
    { question: "Acid in stomach?", options: ["HCl", "H2SO4", "HNO3", "CH3COOH"], answer: "HCl" },
    { question: "Human heart chambers?", options: ["2", "3", "4", "5"], answer: "4" }
    
  ],
  history: [
    { question: "Who was first President of USA?", options: ["Abraham Lincoln", "George Washington", "John Adams", "Thomas Jefferson"], answer: "George Washington" },
    { question: "Year World War I began?", options: ["1912", "1914", "1916", "1918"], answer: "1914" },
    { question: "Who built Taj Mahal?", options: ["Akbar", "Shah Jahan", "Babur", "Aurangzeb"], answer: "Shah Jahan" },
    { question: "When was India independent?", options: ["1945", "1946", "1947", "1948"], answer: "1947" },
    { question: "Father of Indian Constitution?", options: ["Mahatma Gandhi", "B.R. Ambedkar", "Nehru", "Subhash Chandra Bose"], answer: "B.R. Ambedkar" },
    { question: "Who discovered America?", options: ["Columbus", "Vasco da Gama", "Magellan", "Cook"], answer: "Columbus" },
    { question: "Where is Great Wall?", options: ["India", "China", "Japan", "Russia"], answer: "China" },
    { question: "Roman numeral for 50?", options: ["L", "X", "C", "V"], answer: "L" },
    { question: "Who was Hitler?", options: ["Scientist", "Politician", "Dictator", "Doctor"], answer: "Dictator" },
    { question: "First Indian PM?", options: ["Gandhi", "Nehru", "Ambedkar", "Tagore"], answer: "Nehru" }
  ],
  geography: [
    { question: "Capital of France?", options: ["Paris", "Berlin", "Madrid", "Rome"], answer: "Paris" },
    { question: "Tallest mountain?", options: ["K2", "Everest", "Kangchenjunga", "Makalu"], answer: "Everest" },
    { question: "Longest river?", options: ["Amazon", "Nile", "Ganga", "Yangtze"], answer: "Nile" },
    { question: "Sahara is a?", options: ["Mountain", "Desert", "River", "Lake"], answer: "Desert" },
    { question: "Largest ocean?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], answer: "Pacific" },
    { question: "Country with most population?", options: ["USA", "India", "China", "Russia"], answer: "China" },
    { question: "Which continent is Australia in?", options: ["Asia", "Europe", "Australia", "Africa"], answer: "Australia" },
    { question: "Earth is ___ planet from Sun?", options: ["2nd", "3rd", "4th", "5th"], answer: "3rd" },
    { question: "Capital of Japan?", options: ["Tokyo", "Kyoto", "Osaka", "Nagoya"], answer: "Tokyo" },
    { question: "Amazon forest is in?", options: ["Asia", "Africa", "South America", "North America"], answer: "South America" }
  ],
  aptitude: [
    {
      question: "If in a certain code, APPLE is written as BQQMF, how will BANANA be written?",
      options: ["CBOBOB", "CBNBNB", "CBNBOB", "CBNANA"],
      answer: "CBOBOB"
    },
    {
      question: "What will be the angle between the hour and minute hand at 3:15?",
      options: ["0°", "7.5°", "15°", "22.5°"],
      answer: "7.5°"
    },
    {
      question: "If TRAIN is written as 20-18-1-9-14, how will PLANE be written?",
      options: ["16-12-1-14-5", "15-13-2-13-4", "17-11-3-15-6", "14-10-2-14-4"],
      answer: "16-12-1-14-5"
    },
    {
      question: "A number gives remainder 2 when divided by 3, and remainder 3 when divided by 5. What could be the number?",
      options: ["17", "18", "23", "28"],
      answer: "23"
    },
    {
      question: "If the length of a rectangle is increased by 10% and the width is decreased by 10%, what is the net percentage change in area?",
      options: ["1% increase", "1% decrease", "No change", "11% increase"],
      answer: "1% decrease"
    },
    {
      question: "A man's age is three times his son's. What will be the ratio of their ages after 10 years?",
      options: ["2:1", "5:3", "3:2", "4:3"],
      answer: "3:2"
    },
    {
      question: "If P + Q means P is greater than Q, and P - Q means P is less than Q, what is the meaning of 5 + 3 - 1?",
      options: ["Incorrect", "Correct", "Both", "Cannot be determined"],
      answer: "Correct"
    },
    {
      question: "A man walks 5 km south, then turns left and walks 3 km. What direction is he facing now?",
      options: ["East", "West", "North", "South"],
      answer: "East"
    },
    {
      question: "If two bells ring together and one rings every 4 seconds and the other every 6 seconds, when will they next ring together?",
      options: ["12", "24", "10", "6"],
      answer: "12"
    },
    {
      question: "What is the next number in the series: 2, 6, 12, 20, __?",
      options: ["28", "30", "32", "40"],
      answer: "30"
    }
  ],
  politics: [
  {
    question: "Who became the Chief Minister of Delhi after the February 2025 elections?",
    options: ["Arvind Kejriwal", "Atishi Marlena", "Rekha Gupta", "Manish Sisodia"],
    answer: "Rekha Gupta"
  },
  {
    question: "Which party achieved a majority in the 2025 Delhi Assembly elections?",
    options: ["Aam Aadmi Party (AAP)", "Indian National Congress", "Bharatiya Janata Party (BJP)", "Shiv Sena"],
    answer: "Bharatiya Janata Party (BJP)"
  },
  {
    question: "What does the 52nd Amendment (1985) in the Indian Constitution pertain to?",
    options: ["Reservation for women", "Anti-defection law", "GST introduction", "Emergency provisions"],
    answer: "Anti-defection law"
  },
  {
    question: "Which alliance did AIADMK rejoin in April 2025?",
    options: ["UPA", "Left Front", "NDA", "Third Front"],
    answer: "NDA"
  },
  {
    question: "What percentage of seats is reserved for women under the One Hundred and Sixth Amendment (2023)?",
    options: ["20%", "25%", "33%", "50%"],
    answer: "33%"
  },
  {
    question: "The Women's Reservation Bill reserves seats for women in which legislative bodies?",
    options: ["Lok Sabha only", "State assemblies only", "Both Lok Sabha & State Assemblies", "Rajya Sabha"],
    answer: "Both Lok Sabha & State Assemblies"
  },
  {
    question: "Anti-defection law was introduced by which constitutional amendment?",
    options: ["61st Amendment", "52nd Amendment", "73rd Amendment", "42nd Amendment"],
    answer: "52nd Amendment"
  },
  {
    question: "Which high-profile missile was unveiled by DRDO in 2025?",
    options: ["Agni V", "BM-04", "Prithvi-II", "Nirbhay"],
    answer: "BM-04"
  },
  {
    question: "Which state was declared India's 58th tiger reserve in 2025?",
    options: ["Ranthambore", "Bandhavgarh", "Madhav National Park", "Jim Corbett"],
    answer: "Madhav National Park"
  },
  {
    question: "The Waqf (Amendment) Act, 2025 sparked protests primarily in?",
    options: ["Punjab", "West Bengal", "Kerala", "Gujarat"],
    answer: "West Bengal" 
  }
]

};

export default questions;
