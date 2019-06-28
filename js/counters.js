
var sentences = [],
    sentence_pairs = [],
    anaphora_examples = [],
    epiphora_examples = [],
    simploka_examples = [],
    anadiplosis_examples = [],
    srepeat_examples = [],
    multiunion_examples = [],
    multiunion_pairs_examples = [],
    aposiopesis_examples = [],
    result = [],
    unions = [
              "а", "и", "но", "да", "что", "зато", "если", "потому", "поэтому",
              "тоже", "также", "или", "как", "когда", "где", "почему", "однако",
              "but", "till", "as", "if", "after", "until", "because", "and",
              "or", "nor", "so", "before", "since", "that", "till", "until",
              "unless", "whether", "while", "where", "when", "why", "what",
              "how", "whenever", "although", "though", "once", "than", "whereas",
              "thus"
            ],
    pair_unions = [["both", "and"], ["either", "or"], ["not only", "but"], ["not only", "but also"],
                   ["rather", "or"], ["just as", "so"], ["neither", "nor"], ["whether", "or"],
                   ["if", "then"]],
    union_adverbs = ["after all", "as a result", "for example", "in addition", "in fact", "in other words",
                     "on the other hand"],
    prepositions = [
                  "без", "в", "для", "за", "из", "к", "на", "над", "о", "об", "от", "по", "под", "пред", "при", "про", "с", "у", 
                  "a", "the", "to", "at", "in", "about", "against", "before", "of", "an", "on", "is", "are", "be", "was", "were"
                  ];

function getAllSentences() {
  text = workarea.textContent;
  sentences = [];
  tempSentence = "";
  sub_array = [];
  while(text.match(/[^.!?]+[.!?]{1,3}/)) {
    tempSentence=text.match(/[^.!?]+[.!?]{1,3}/);
    tempSentence = tempSentence[0];
    if(tempSentence.match(/\n/g) != null) {
      sub_array = tempSentence.split(/\n/);
      for(i=0; i<sub_array.length; i++) {
        if(sub_array[i].match(/[a-zA-Zа-яА-ЯёЁ]/) != null) {
          if(sub_array.length == 0){
            sentences.push(sub_array[i]);
          }
          else {
            sentences.push(" "+sub_array[i]);
          }
        }
      }
    }
    else {
      sentences.push(tempSentence);
    }
    text = text.replace(tempSentence, "");
  }
  sub_array = [];
  flag = true;
  number = 0;
  while (flag != false) {
    flag = false;
    for(var i = 1; i<sentences.length; i++) {
      if(sentences[i][0] != ' ' && sentences[i][0] != '↵' || (sentences[i][1] == ")" && sentences[i][0] == " ")) {
        flag = true;
        number = i;
      }
    }
    if(flag) {
      sentences[number-1] = sentences[number-1] + sentences[number];
      sub_array = [];
      for(i=0; i<sentences.length; i++) {
        if(i != number) {
          sub_array.push(sentences[i]);
        }
      }
      sentences = sub_array;
    }
  }
  flag = true;
  while (flag != false) {
    flag = false;
    for(var i = 1; i<sentences.length; i++) {
      if(sentences[i][0] == ' ' && sentences[i].length == 3 && sentences[i][sentences[i].length-1] == '.') {
        flag = true;
        number = i;
      }
    }
    if(flag) {
      sentences[number-1] = sentences[number-1] + sentences[number] + sentences[number+1];
      sub_array = [];
      for(i=0; i<sentences.length; i++) {
        if(i != number && i != number + 1) {
          sub_array.push(sentences[i]);
        }
      }
      sentences = sub_array;
    }
  }
  flag = true;
  while (flag != false) {
    flag = false;
    for(var i = 1; i<sentences.length; i++) {
      if(sentences[i].match(/[:]\s$/) != null || sentences[i].match(/Mr[.]$/) != null) {
        flag = true;
        number = i;
      }
    }
    if(flag) {
      sentences[number] = sentences[number] + sentences[number+1];
      sub_array = [];
      for(i=0; i<sentences.length; i++) {
        if(i != number + 1) {
          sub_array.push(sentences[i]);
        }
      }
      sentences = sub_array;
    }
  }
  for(var i = 1; i<sentences.length; i++) {
    sentences[i] = sentences[i].replace(/\s+/, " ");
    sentences[i] = sentences[i].substring(1);
  }
  getAllSentencePairs();
}

function getAllSentencePairs() {
  for(i=1; i<sentences.length; i++) {
    sentence_pairs.push(sentences[i-1] + " " + sentences[i]);
  }
}

//This function searches for anaphores in the text and forms an array with them.
function getAnaphoraCount() {
  text = workarea.textContent;
  anaphora_candidates = [];
  first_index = 0;
  last_index = 0;
  for(i=0; i < sentences.length-1; i++) {
    if(sentences[i] == "`I must.") debugger;
    first_word = sentences[i].match(/\S+/)[0];
    check_higher_case = first_word.match(/[A-ZА-ЯЁ]/);
    if(check_higher_case == null) {
      continue;
    }
    if(first_word.match("Chapter") != null || first_word.toLowerCase() == "a" || first_word.toLowerCase() == "an" || first_word.toLowerCase() == "the") {
      continue;
    }
    first_index = i;
    last_index = first_index;
    for(j=i+1; j<sentences.length; j++) {
      if(first_word == sentences[j].match(/\S+/)[0]) {
        last_index = j;
      }
      else {
        break;
      }
    }
    if(last_index > first_index) {
      tmp = [];
      for(first_index; first_index <= last_index; first_index++) {
        tmp.push(sentences[first_index]);
      }
      anaphora_candidates.push([first_word, tmp]);
      i = last_index;
    }
  }
  flag = true;
  if(anaphora_candidates.length !=0) {
    while(flag) {
      control_array = [];
      for(i=0; i<anaphora_candidates.length; i++) {
        first_words = new RegExp(anaphora_candidates[i][0].replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\)/g, "[)]").replace(/\(/g,"[(]") + "((\\.|\\!){3}|\\.|\\?|\\!){0,1}\\s\\S+");
        if(anaphora_candidates[i][1][0].match(first_words) != null) {
          first_words = anaphora_candidates[i][1][0].match(first_words)[0];
          tmp = [];
          for(j=0; j < anaphora_candidates[i][1].length; j++) {
            if(anaphora_candidates[i][1][j].match(first_words.replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\)/g, "[)]").replace(/\(/g,"[(]")) != null) {
              tmp.push(true);
            }
            else {
              tmp.push(false);
            }
          }
          control_array.push(tmp);
          if(tmp.indexOf(false) == -1) {
            anaphora_candidates[i][0] = first_words;
          }
        }
      }
      
      for(i=0; i<control_array.length; i++) {
        if(control_array[i].indexOf(false) != -1) {
          control_array[i] = false;
        }
        else {
          control_array[i] = true;
        }
      }
      if(control_array.indexOf(false) != -1){
        flag = false;
      }
      else {
        flag = true;
      }
    }


    flag = true;
    while(flag) {
      control_array = [];
      for(i=0; i<anaphora_candidates.length; i++) {
        first_words = new RegExp(anaphora_candidates[i][0].replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\)/g, "[)]").replace(/\(/g,"[(]") + "((\\.|\\!){3}|\\.|\\?|\\!){0,1}\\s\\S+");
        if(anaphora_candidates[i][1][0].match(first_words) != null) {
          first_words = anaphora_candidates[i][1][0].match(first_words)[0];
          tmp = [];
          for(j=0; j < anaphora_candidates[i][1].length; j++) {
            if(anaphora_candidates[i][1][j].match(first_words.replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\)/g, "[)]").replace(/\(/g,"[(]")) != null) {
              tmp.push(true);
            }
            else {
              tmp.push(false);
            }
          }
          control_array.push(tmp);
          if(tmp.indexOf(false) == -1) {
            anaphora_candidates[i][0] = first_words;
          }
        }
      }
      for(i=0; i<control_array.length; i++) {
        if(control_array[i].indexOf(false) != -1) {

          control_array[i] = true;
        }
        else {
          control_array[i] = false;
        }
      }
      if(control_array.indexOf(false) == -1){
        flag = false;
      }
      else {
        flag = true;
      }

    }
  }
  temp = [];
  for(i=0; i<anaphora_candidates.length; i++) {
    anaphora_length = anaphora_candidates[i][0].split(" ").length;
    count = 0;
    for(j=0; j<anaphora_candidates[i][1].length; j++) {
      if(anaphora_candidates[i][1][j].split(" ").length == anaphora_length && anaphora_length < 5) {
        count++;
      }
    }
    if (count!=anaphora_candidates[i][1].length) {
      temp.push(anaphora_candidates[i])
    }
  }
  anaphora_candidates = temp;
  for(i=0; i<anaphora_candidates.length; i++) {
    if(anaphora_candidates[i][0][anaphora_candidates[i][0].length-1] == ".") {
      anaphora_candidates[i][0] = anaphora_candidates[i][0].substring(0, anaphora_candidates[i][0].length-1);
    }
  }
  result = anaphora_candidates;
  return result.length
}

//This function searches for epiphoras in the text and forms an array with them.
function getEpiphoraCount() {
  text = workarea.textContent;
  
  epiphora_candidates = [];
  first_index = 0;
  last_index = 0;
  for(i=0; i < sentences.length-1; i++) {
    if(sentences[i].match(/\S+$/) == null) {
      last_word = sentences[i].match(/\S+\s$/)[0];
    }
    else {
      last_word = sentences[i].match(/\S+$/)[0];
    }
    if(last_word.match("said")) {
      continue;
    }
    first_index = i;
    last_index = first_index;
    for(j=i+1; j<sentences.length; j++) {
      if(last_word == sentences[j].match(last_word.replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\*/g, "[*]").replace(/\?/g,"[?]").replace(/\)/g, "[)]").replace(/\(/g,"[(]"))) {
        last_index = j;
      }
      else {
        break;
      }
    }
    if(last_index > first_index) {
      tmp = [];
      tmp2 = [];
      for(first_index; first_index <= last_index; first_index++) {
        tmp.push(sentences[first_index]);
        tmp2.push(first_index);
      }
      epiphora_candidates.push([last_word, tmp, tmp2]);
      i = last_index;
    }
  }
  flag = true;
  if(epiphora_candidates.length != 0) {
    while(flag) {
      control_array = [];
      for(i=0; i<epiphora_candidates.length; i++) {
        last_words = new RegExp("\\S+\\s" + epiphora_candidates[i][0].replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\?/g,"[?]"));
        if(epiphora_candidates[i][1][0].match(last_words) != null) {
          last_words = epiphora_candidates[i][1][0].match(last_words)[0];
          tmp = [];
          for(j=0; j < epiphora_candidates[i][1].length; j++) {
            if(epiphora_candidates[i][1][j].match(last_words.replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\?/g,"[?]")) != null) {
              tmp.push(true);
            }
            else {
              tmp.push(false);
            }
          }
          control_array.push(tmp);
          if(tmp.indexOf(false) == -1) {
            epiphora_candidates[i][0] = last_words;
          }
        }
      }
      for(i=0; i<control_array.length; i++) {
        if(control_array[i].indexOf(false) != -1) {
          control_array[i] = false;
        }
        else {
          control_array[i] = true;
        }
      }
      if(control_array.indexOf(false) != -1){
        flag = false;
      }
      else {
        flag = true;
      }
    }

    flag = true;
    while(flag) {
      control_array = [];
      for(i=0; i<epiphora_candidates.length; i++) {
        last_words = new RegExp("\\S+\\s" + epiphora_candidates[i][0].replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\?/g,"[?]"));
        if(epiphora_candidates[i][1][0].match(last_words) != null) {
          last_words = epiphora_candidates[i][1][0].match(last_words)[0];
          tmp = [];
          for(j=0; j < epiphora_candidates[i][1].length; j++) {
            if(epiphora_candidates[i][1][j].match(last_words.replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\?/g,"[?]")) != null) {
              tmp.push(true);
            }
            else {
              tmp.push(false);
            }
          }
          control_array.push(tmp);
          if(tmp.indexOf(false) == -1) {
            epiphora_candidates[i][0] = last_words;
          }
        }
      }
      for(i=0; i<control_array.length; i++) {
        if(control_array[i].indexOf(false) != -1) {
          control_array[i] = true;
        }
        else {
          control_array[i] = false;
        }
      }
      if(control_array.indexOf(false) == -1){
        flag = false;
      }
      else {
        flag = true;
      }
    }
  }

  for(i=0; i < epiphora_candidates.length; i++) {
    delete epiphora_candidates[i].pop()
  }

  temp = [];
  for(i=0; i<epiphora_candidates.length; i++) {
    epiphora_length = epiphora_candidates[i][0].split(" ").length;
    count = 0;
    for(j=0; j<epiphora_candidates[i][1].length; j++) {
      if(epiphora_candidates[i][1][j].split(" ").length == epiphora_length && epiphora_length < 5) {
        count++;
      }
    }
    if (count!=epiphora_candidates[i][1].length) {
      temp.push(epiphora_candidates[i])
    }
  }
  epiphora_candidates = temp;

  result = epiphora_candidates;
  return result.length;
}

//This function searches for simplokas in the text and forms an array with them.
function getSimplokaCount() {

  flag = true;
  for(i=0; i<anaphora_examples.length; i++) {
    for(j=0; j<epiphora_examples.length; j++) {
      flag = true;
      if(anaphora_examples[i][1].length == epiphora_examples[j][1].length)
      {
        for(t=0; t<anaphora_examples[i][1].length; t++) {
          if(anaphora_examples[i][1][t] != epiphora_examples[j][1][t]) {
            flag = false;
            break;
          }
        }
      }
      else flag = false;
      if(flag) {
        let tmp_array = anaphora_examples[i].slice();
        tmp_array[1] = anaphora_examples[i][1].slice();
        simploka_examples.push(tmp_array);
        simploka_examples[simploka_examples.length - 1][2] = epiphora_examples[j][0];
      }
    }
  }

  result = simploka_examples;
  return result.length;
}

//This function searches for anadiplosises in the text and forms an array with them.
function getAnadiplosisCount() {
  text = workarea.textContent;
  search_string = "[a-zA-Zа-яА-ЯёЁ]+[.?!;]{1,3}\\s[a-zA-Zа-яА-ЯёЁ]+";
  middle_words = text.match(/[a-zA-Zа-яА-ЯёЁ]+[.?!;]{1,3}\s[a-zA-Zа-яА-ЯёЁ]+/g);
  new_phrases = [];
  result = [];
  if(middle_words != null) {
    for (i=0; i < middle_words.length; i++) {
      phrase = middle_words[i];
      phrase = phrase.toLowerCase();
      near_space = phrase.match(/[.?!;]{1,3}\s/)[0];
      phrase = phrase.split(near_space);
      if(phrase[0] == phrase[1]) {
        new_phrases.push(middle_words[i]);
      }
    }
    result = new_phrases;

    tmp = [];
    for(key in result) {
      if(tmp.indexOf(result[key]) == -1) {
        tmp.push(result[key]);
      }
    }
    result = tmp;
    count = 0;

    search_string = "([a-zA-Zа-яА-ЯёЁ]+\\s){0}" + search_string + "(\\s[a-zA-Zа-яА-ЯёЁ]+){0}";
    while(new_phrases.length != 0) {

      middle_words = [];
      count++;
      search_reg = new RegExp("\\{"+(count-1)+"\\}", 'g');
      search_string = search_string.replace(search_reg, "{"+count+"}");
      middle_words = text.match(new RegExp(search_string,"g"));
      new_phrases = [];
      if(middle_words != null) {
        for (i=0; i < middle_words.length; i++) {
          phrase = middle_words[i];
          phrase = phrase.toLowerCase();
          near_space = phrase.match(/[^a-zA-Zа-яА-ЯёЁ]{1,3}\s/)[0];
          phrase = phrase.split(near_space);
          temp = middle_words[i].split(near_space);
          for(j=0; j<phrase.length-1; j++) {
            if(phrase[j] == phrase[j+1]) {
              new_phrases.push(temp[j] + near_space + temp[j+1]);
            }  
          }
        }

        for(key in new_phrases) {
          result.push(new_phrases[key]);
        }
      }

    }
    tmp = [];
    for(key in result) {
      if(tmp.indexOf(result[key]) == -1) {
        tmp.push(result[key]);
      }
    }
    result = tmp;
  }
  return result.length;
}

//This function searches for simple repeats in the text and forms an array with them.
function getSrepeatCount() {
  srepeat_examples = [];
  srepeats_for_sentences = [];
  result = [];
  for(i=0; i<sentences.length; i++) {
    sentence = [];
    sentence = sentences[i].replace(/[^a-zA-Zа-яА-ЯёЁ \n']/g, " ");
    sentence = sentence.replace(/\s+/g, " ");
    sentence = sentence.toLowerCase();
    sentence = sentence.substring(0,sentence.length-1);
    sentence = sentence.split(" ");
    
    sub_result = sentence.reduce(function (acc, el) {
      acc[el] = (acc[el] || 0) + 1;
      return acc;
    }, {});

    tmp = [];
    for(key in sub_result) {
      if(sub_result[key] > 1 && unions.indexOf(key) == -1 && prepositions.indexOf(key) == -1) {
        tmp.push(key);
        result.push(key);
      }
    }
    srepeat_examples.push([sentences[i], tmp]);
  }
  tmp = []
  for(key in srepeat_examples) {
    tmp = []
    for(i=0; i<srepeat_examples[key][1].length; i++){
      if(srepeat_examples[key][1].length != 0) {
        if(srepeat_examples[key][1][i] != "'" || srepeat_examples[key][1][i] == "i") {
          tmp.push(srepeat_examples[key][1][i])
        }
      }
    }
    srepeat_examples[key][1] = tmp;
  }

  count = 0;
  for(i=0; i<srepeat_examples.length; i++) {
    if(srepeat_examples[i][1].length != 0) {
      for(j=0; j<srepeat_examples[i][1].length; j++) {
        count++;
          }
      }
  }

  return count;
}

function getMultiUnionCount() {
  multiunion_examples = [];
  multiunion_pairs_examples = [];
  for(i=0; i<sentences.length; i++) {
    temp_sentence = sentences[i].replace(/[^a-zA-Zа-яА-ЯёЁ \n']/g, " ");
    temp_sentence = temp_sentence.replace(/\s+/g, " ");
    temp_sentence = temp_sentence.toLowerCase();
    temp_sentence = temp_sentence.split(" ");
    temp_sentence = temp_sentence.reduce(function (acc, el) {
      acc[el] = (acc[el] || 0) + 1;
      return acc;
    }, {});
    tmp = [];
    for(key in temp_sentence) {
      if(temp_sentence[key] > 2 && unions.indexOf(key) != -1) {
        tmp.push(key);
      }
    }
    if(tmp.length != 0) {
      multiunion_examples.push([sentences[i],tmp]);
    }
  }
  for(i=0; i<sentences.length; i++) {
    for(j=0; j<pair_unions.length; j++) {
      if(sentences[i].match(new RegExp("\\b"+pair_unions[j][0],"gi")) != null && sentences[i].match(new RegExp("\\b"+pair_unions[j][1],"gi")) != null) {
        if((sentences[i].match(new RegExp("\\b"+pair_unions[j][0],"gi"))).length > 1 && (sentences[i].match(new RegExp("\\b"+pair_unions[j][1],"gi"))).length > 1) {
          temp_sentence = sentences[i];
          temp_sentence = temp_sentence.replace(new RegExp("\\b"+pair_unions[j][0],"gi"), "@"+pair_unions[j][0]);
          temp_sentence = temp_sentence.replace(new RegExp("\\b"+pair_unions[j][1],"gi"), pair_unions[j][1]+"#");
          tmp = [];
          tmp = temp_sentence.match(/@[a-zA-Zа-яА-ЯёЁ\s]+#/g);
          if(tmp != null) {
            for(t=0; t<tmp.length;t++) {
              tmp[t] = tmp[t].substring(1, tmp[t].length-1);
            }
            if(tmp.length > 1) {
              multiunion_pairs_examples.push([sentences[i], pair_unions[j], tmp]);
            }
          }
        }
      }
    }
  }

  for(i=0; i<sentences.length; i++) {
    for(j=0; j<union_adverbs.length; j++) {
      if(sentences[i].match(union_adverbs[j]) != null) {
        if((sentences[i].match(new RegExp(union_adverbs[j],"gi"))).length > 1) {
          multiunion_examples.push([sentences[i],[union_adverbs[j]]]);
        }
      }
    }
  }

  count = 0;
  for(i=0; i<multiunion_examples.length; i++) {
    for(j=0; j<multiunion_examples[i][1].length; j++) {
      count++;
    }
  }
  for(i=0; i<multiunion_pairs_examples.length; i++) {
    for(j=0; j<multiunion_pairs_examples[i][1].length; j++) {
      count++;
    }
  }
  return count;
}

function getAposiopesisCount() {
  aposiopesis_examples = [];
  for(i=0; i<sentences.length-1; i=i+2) {
    if(sentences[i].indexOf("...") != -1 || sentences[i].indexOf("…") != -1) {
      aposiopesis_examples.push([sentences[i],sentences[i+1],[i, i+1]]);
    }
  }
  return aposiopesis_examples.length;
}