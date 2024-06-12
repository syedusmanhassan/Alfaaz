import React from 'react';
import "../main.css"

const pluralize = (word) => {
  return word.endsWith('s') ? word : word + 's';
};

const religion_keywords = new Set([
  'muslim', 'islam', 'hindu', 'christian', 'jewish', 'buddhist', 'sikh',
  'catholic', 'protestant', 'mormon', 'shia', 'sunni', 'kuffar', 'infidel',
  'jihadi', 'terrorist', 'heathen', 'pagan', 'jews'
]);

const race_keywords = new Set([
  'black', 'white', 'hispanic', 'asian', 'nigger', 'nigga', 'latino', 'african',
  'caucasian', 'indian', 'chinese', 'japanese', 'mexican', 'arab', 'slant-eye',
  'beaner', 'wetback', 'cracker', 'redneck', 'gypsy', 'gook', 'chink'
]);

const gender_keywords = new Set([
  'male', 'female', 'transgender', 'trans', 'cisgender', 'cis', 'nonbinary',
  'genderqueer', 'feminist', 'misogynist', 'misandrist', 'faggot', 'dyke',
  'tranny', 'he', 'she', 'they', 'him', 'her', 'them', 'bitch'
]);

const mental_health_keywords = new Set([
  'psychiatric', 'mental illness', 'schizophrenic', 'bipolar', 'depressed',
  'anxiety', 'ocd', 'adhd', 'autistic', 'retard', 'crazy', 'lunatic', 'insane',
  'psychotic', 'manic', 'narcissist', 'sociopath', 'psychopath'
]);

const threat_keywords = new Set([
  'kill', 'murder', 'assassinate', 'slaughter', 'destroy', 'attack',
  'bomb', 'shoot', 'stab', 'burn', 'hang', 'lynch', 'massacre', 'rape',
  'abuse', 'torture', 'beat', 'bash', 'smash', 'hurt', 'harm', 'terrorize',
  'explode', 'annihilate', 'eradicate', 'exterminate', 'strangle',
  'choke', 'drown', 'decapitate', 'guillotine', 'execute', 'eliminate',
  'eradicate', 'terminate', 'maim', 'cripple', 'suffocate', 'poison',
  'assault', 'batter', 'butcher', 'gut', 'impale'
]);

const sexual_orientation_keywords = new Set([
  'gay', 'lesbian', 'bisexual', 'homosexual', 'heterosexual', 'straight',
  'queer', 'asexual', 'pansexual', 'closeted', 'out', 'coming out',
  'faggot', 'dyke', 'homo', 'fruit', 'fairy', 'poof'
]);

const character_behavioral_keywords = new Set([
  'coward', 'weakling', 'loser', 'scaredy-cat', 'spineless', 'gutless',
  'chicken', 'quitter', 'wimp', 'pushover', 'fraud', 'phony', 'charlatan'
]);

const identityKeywords = {
  religion: religion_keywords,
  race: race_keywords,
  gender: gender_keywords,
  mental_health: mental_health_keywords,
  threat: threat_keywords,
  sexual_orientation: sexual_orientation_keywords,
  character_behavioral: character_behavioral_keywords
};

const expandedIdentityLabels = {};

Object.entries(identityKeywords).forEach(([category, keywords]) => {
  keywords.forEach((keyword) => {
    const pluralForm = pluralize(keyword);
    expandedIdentityLabels[keyword] = category;
    expandedIdentityLabels[pluralForm] = category;
  });
});

const extractContext = (text) => {
  const words = text.toLowerCase().split(/\s+/);
  const context = {};
  const wordFrequency = {};

  words.forEach((word) => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  Object.entries(wordFrequency).forEach(([word]) => {
    if (expandedIdentityLabels[word]) {
      context[word] = expandedIdentityLabels[word];
    }
  });

  return context;
};

const ContextAnalysis = ({ data, thresholds }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const inputSentence = localStorage.getItem('inputSentence') || '';
  const contextWithKeywords = extractContext(inputSentence);

  const contextText = Object.entries(contextWithKeywords).length
    ? Object.entries(contextWithKeywords).map(([keyword, category]) => `${keyword} (${category})`).join(', ')
    : 'No context-related entities found';

  const belowThreshold = data.every(item => item.score < thresholds[item.label]);

  // Calculate the second and third highest score labels
  const sortedData = data.slice().sort((a, b) => b.score - a.score);
  const topScores = sortedData.slice(1, 3).map(item => item.label);

  const highlightText = (text, keywords) => {
    const words = text.split(/\s+/);
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();
      if (keywords[cleanWord]) {
        return <span key={index} className="highlight">{word}</span>;
      }
      return word + ' ';
    }).reduce((prev, curr) => [prev, ' ', curr]);
  };

  return (
    <div className="context-analysis">
      <h3>Context Analysis</h3>
      <p>Comment: {highlightText(inputSentence, contextWithKeywords)}</p>
      {!belowThreshold && topScores.length > 0 && (
        <p>Detected: Given Input was found with more <span className="highlight">{topScores[0]}</span> and <span className="highlight">{topScores[1]}</span> based remarks.</p>
)}
      <p>Context: {belowThreshold ? 'No hate found' : contextText}</p>
      {!belowThreshold && Object.entries(contextWithKeywords).length > 0 && (
        <div>
          <h4>Detected Keywords:</h4>
          <ul>
            {Object.entries(contextWithKeywords).map(([keyword, category]) => (
              <li key={keyword}>{keyword} (Category: {category})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContextAnalysis;
