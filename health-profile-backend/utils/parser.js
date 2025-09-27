const yesNoToBool = (val) => {
  if (typeof val !== 'string') return undefined;
  const v = val.trim().toLowerCase();
  if (['yes', 'y', 'true', '1'].includes(v)) return true;
  if (['no', 'n', 'false', '0'].includes(v)) return false;
  return undefined;
};

exports.parseTextToAnswers = (text) => {
  const answers = {};
  const patientInfo = {};
  const missing_fields = [];
  let confidence = 0.9;

  const getMatch = (regex) => {
    const m = text.match(regex);
    return m && m[1] ? m[1].trim() : undefined;
  };

  // Extract personal information
  const name = getMatch(/(?:name|patient)[:\s]*([a-zA-Z\s]+)/i);
  if (name) {
    patientInfo.name = name;
  }

  const gender = getMatch(/(?:gender|sex)[:\s]*(male|female|m|f)/i);
  if (gender) {
    patientInfo.gender = gender.toLowerCase() === 'm' ? 'male' : 
                        gender.toLowerCase() === 'f' ? 'female' : gender.toLowerCase();
  }

  const phone = getMatch(/(?:phone|mobile|contact)[:\s]*([0-9\-\+\s\(\)]+)/i);
  if (phone) {
    patientInfo.phone = phone.replace(/\s+/g, '');
  }

  const email = getMatch(/(?:email|mail)[:\s]*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  if (email) {
    patientInfo.email = email.toLowerCase();
  }

  const address = getMatch(/(?:address|location)[:\s]*([a-zA-Z0-9\s,.-]+)/i);
  if (address) {
    patientInfo.address = address;
  }

  // Extract health information
  const ageStr = getMatch(/age[:\s]*([0-9]{1,3})/i);
  if (ageStr) {
    const age = parseInt(ageStr, 10);
    if (!Number.isNaN(age)) {
      answers.age = age;
      patientInfo.age = age;
    }
  } else {
    missing_fields.push('age');
    confidence -= 0.05;
  }

  const smokerStr = getMatch(/smoker[:\s]*(yes|no|y|n|true|false|0|1)/i);
  const smoker = yesNoToBool(smokerStr);
  if (typeof smoker === 'boolean') {
    answers.smoker = smoker;
  } else {
    const smokerAlt = getMatch(/smoking[:\s]*(?:status|habit)?[:\s]*(yes|no|y|n|true|false|0|1)/i);
    const smoker2 = yesNoToBool(smokerAlt);
    if (typeof smoker2 === 'boolean') {
      answers.smoker = smoker2;
    } else {
      missing_fields.push('smoker');
      confidence -= 0.05;
    }
  }

  const exercise = getMatch(/exercise[:\s]*([a-z\s]+)/i);
  if (exercise) {
    answers.exercise = exercise.toLowerCase();
  } else {
    missing_fields.push('exercise');
    confidence -= 0.03;
  }

  const diet = getMatch(/diet[:\s]*([a-z\s]+)/i);
  if (diet) {
    answers.diet = diet.toLowerCase();
  } else {
    missing_fields.push('diet');
    confidence -= 0.03;
  }

  confidence = Math.max(0, Math.min(1, Number(confidence.toFixed(2))));

  return { answers, patientInfo, missing_fields, confidence };
};
