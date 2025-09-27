exports.computeRisk = (answers) => {
  let score = 0;
  const recs = [];
  const factors = [];
  const rationale = [];

  if (typeof answers.age === 'number') {
    if (answers.age >= 60) score += 30;
    else if (answers.age >= 45) score += 20;
    else if (answers.age >= 30) score += 10;
  } else {
    recs.push('Provide age for accurate risk scoring');
  }

  if (answers.smoker === true) {
    score += 30;
    recs.push('Quit smoking');
    factors.push('smoking');
    rationale.push('smoking');
  } else if (answers.smoker === false) {
    score -= 5;
  } else {
    recs.push('Clarify smoking status');
  }

  if (typeof answers.exercise === 'string') {
    const ex = answers.exercise.toLowerCase();
    if (/(never|rarely|sedentary|none)/.test(ex)) {
      score += 20;
      recs.push('Start light physical activity (walk 30 mins daily)');
      factors.push('low exercise');
      rationale.push('low activity');
    } else if (/(sometimes|occasional|weekly)/.test(ex)) {
      score += 10;
      recs.push('Increase exercise frequency to 3–5 times/week');
    } else if (/(regular|daily|active|moderate|high)/.test(ex)) {
      score += 0;
    } else {
      recs.push('Specify exercise frequency for better guidance');
    }
  }

  if (typeof answers.diet === 'string') {
    const d = answers.diet.toLowerCase();
    if (/(high sugar|high fat|processed|junk)/.test(d)) {
      score += 20;
      recs.push('Reduce sugar and processed foods');
      factors.push('poor diet');
      rationale.push('high sugar diet');
    } else if (/(balanced|healthy|low sugar|low fat|vegetarian|mediterranean)/.test(d)) {
      score -= 5;
    } else {
      recs.push('Improve diet quality (more whole foods, fiber, lean protein)');
    }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let risk_level = 'low';
  if (score >= 70) risk_level = 'high';
  else if (score >= 40) risk_level = 'medium';

  if (risk_level === 'high') {
    recs.unshift('Consult a healthcare provider for personalized guidance');
  } else if (risk_level === 'medium') {
    recs.unshift('Monitor lifestyle factors and schedule regular checkups');
  } else {
    recs.unshift('Maintain healthy habits and regular physical activity');
  }

  const recommendations = Array.from(new Set(recs));

  // Ensure uniqueness in factors and rationale as well
  const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));
  return { risk_level, score, recommendations, factors: uniq(factors), rationale: uniq(rationale) };
};
