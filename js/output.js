var text_words,
    sentences_range = [],
    sentence_pairs_range = [],
    anaphoras_range = [],
    epiphoras_range = [],
    simploka_range = [],
    anadiplosis_range = [],
    srepeat_range = [],
    munion_range = [],
    aposiopesis_range = [],
    output_data = [],
    json_data = {};

function getWordsArray(work_text) {
  text_words = work_text.replace(/\n/g, " ");
  text_words = text_words.split(" ");
  tmp = [];
  for(key in text_words) {
    if(text_words[key] != "") {
      tmp.push(text_words[key]);
    }
  }
  text_words = tmp;
  return text_words;
}

function getSentencesRanges() {
  getWordsArray(workarea_text);
  sentences_range = [];
  first_index = 0;
  last_index = 1;
  sentence_string = text_words[0];
  i=0;
  for(last_index=1; last_index<text_words.length; last_index++) {
    if(text_words[last_index].substring(text_words[last_index].length-1) == "'" || text_words[last_index].substring(text_words[last_index].length-1) == '"'){
      if(text_words[last_index].substring(text_words[last_index].length-2,text_words[last_index].length-1) == "'" 
        || text_words[last_index].substring(text_words[last_index].length-2,text_words[last_index].length-1) == '"') {
        sentence_string += " " + text_words[last_index].substring(0,text_words[last_index].length-2);
      }
      else {
        if(typeof sentences[i] !== 'undefined' && sentences[i].match((sentence_string + " " + text_words[last_index]).replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\?/g,"[?]")) != null) {
          sentence_string += " " + text_words[last_index];
        }
        else {
          sentence_string += " " + text_words[last_index].substring(0,text_words[last_index].length-1);
        }
      }
    }
    else {
      sentence_string += " " + text_words[last_index];
    }
    if(typeof sentences[i] !== 'undefined' && sentences[i].match(sentence_string.replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\?/g,"[?]")) == null || last_index == text_words.length - 1) {
      sentences_range.push([sentences[i], [first_index, last_index]]);
      if(last_index != text_words.length - 1) {
        i++;
        first_index = last_index;
        sentence_string = text_words[last_index];
      }
    }
  }
  getSentencePairsRanges();
}

function getSentencePairsRanges() {
  sentence_pairs_range = [];
  for(i=1;i<sentences_range.length;i++) {
    sentence_pairs_range.push([sentences_range[i-1][0] + " " + sentences_range[i][0], [sentences_range[i-1][1][0], sentences_range[i][1][1]]])
  }
}

function getAnaphorasRanges() {
  anaphoras_range = [];
  for(i=0; i<anaphora_examples.length; i++) {
    let range = [];
    for(t=0; t<sentences_range.length; t++){
      if(anaphora_examples[i].length == 2) {
        if(sentences_range[t][0] == anaphora_examples[i][1][0]) {
          let flag = true;
          for(h=1; h<anaphora_examples[i][1].length; h++) {
            if(sentences_range[t+h][0] != anaphora_examples[i][1][h]) {
              flag = false
            }
          }
          if(flag) {
            range.push(sentences_range[t][1][0]);
            range.push(sentences_range[t+anaphora_examples[i][1].length-1][1][1])
          }
        }
      }
      if(anaphora_examples[i].length == 3) {
        if(sentences_range[t][0] == anaphora_examples[i][2][0]) {
          let flag = true;
          for(h=1; h<anaphora_examples[i][2].length; h++) {
            if(sentences_range[t+h][0] != anaphora_examples[i][2][h]) {
              flag = false
            }
          }
          if(flag) {
            range.push(sentences_range[t][1][0]);
            range.push(sentences_range[t+anaphora_examples[i][2].length-1][1][1])
          }
        }
      }
    }
    let words_numbers = [];
    for(t=range[0]; t<range[1]; t++) {
      let temp_str = text_words[t].replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\?/g,"[?]");
      let temp_reg = new RegExp("\\s"+temp_str+"\\s|\\s"+temp_str+"|"+temp_str+"\\s","g")
      if(anaphora_examples[i][0].match(temp_reg) != null || anaphora_examples[i][0].toLowerCase().match(temp_reg) != null || anaphora_examples[i][0] == text_words[t]) {
        words_numbers.push(t);
      }
    }
    anaphoras_range.push({"type": "anaphora", "words": words_numbers, "context": range})
  }
}

function getEpiphorasRanges() {
  epiphoras_range = [];
  for(i=0; i<epiphora_examples.length; i++) {
    let range = [];
    for(t=0; t<sentences_range.length; t++) {
      if(epiphora_examples[i].length == 2) {
        if(sentences_range[t][0] == epiphora_examples[i][1][0]) {
          range.push(sentences_range[t][1][0]);
          range.push(sentences_range[t+epiphora_examples[i][1].length-1][1][1])
        }
      }
      if(epiphora_examples[i].length == 3) {
        if(sentences_range[t][0] == epiphora_examples[i][2][0]) {
          range.push(sentences_range[t][1][0]);
          range.push(sentences_range[t+epiphora_examples[i][2].length-1][1][1])
        }
      }
    }
    let words_numbers = [];
    for(t=range[0]; t<range[1]; t++) {
      let temp_str = text_words[t].replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\?/g,"[?]");
      let temp_reg = new RegExp("\\s"+temp_str+"\\s|\\s"+temp_str+"|"+temp_str+"\\s","g")
      if(epiphora_examples[i][0].match(temp_reg) != null || epiphora_examples[i][0].toLowerCase().match(temp_reg) != null || epiphora_examples[i][0] == text_words[t]) {
        words_numbers.push(t);
      }
    }
    epiphoras_range.push({"type": "epiphora", "words": words_numbers, "context": range})
  }
}

function getSimplokasRanges() {
  simploka_range = [];
  for(i=0; i<simploka_examples.length; i++) {
    let range = [];
    for(t=0; t<sentences_range.length; t++){
      if(sentences_range[t][0] == simploka_examples[i][1][0]) {
        range.push(sentences_range[t][1][0]);
        range.push(sentences_range[t+simploka_examples[i][1].length-1][1][1])
      }
    }
    let words_numbers = [];
    for(t=range[0]; t<range[1]; t++) {
      let temp_str = text_words[t].replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\?/g,"[?]");
      let temp_reg = new RegExp("\\s"+temp_str+"\\s|\\s"+temp_str+"|"+temp_str+"\\s","g")
      if(simploka_examples[i][0].match(temp_reg) != null || simploka_examples[i][0].toLowerCase().match(temp_reg) != null || simploka_examples[i][0] == text_words[t]
         || simploka_examples[i][2].match(temp_reg) != null || simploka_examples[i][2].toLowerCase().match(temp_reg) != null || simploka_examples[i][2] == text_words[t]) {
        words_numbers.push(t);
      }
    }
    simploka_range.push({"type": "symploce", "words": words_numbers, "context": range})
  }
}

function getAnadiplosisRanges() {
  anadiplosis_view = [];
  for(i=0; i<anadiplosis_examples.length; i++) {
    tmp_array = [];
    if(anadiplosis_examples[i].match(/[.!?]{1,3}/) == null) {
      for(j=0; j<sentences.length; j++) {
        if(sentences[j].match(anadiplosis_examples[i].replace(/\./g,"[.]").replace(/\?/g,"[?]")) != null) {
          tmp_array.push(sentences[j]);
        }
      }
    }
    else {
      for(j=0; j<sentence_pairs.length; j++) {
        if(sentence_pairs[j].match(anadiplosis_examples[i].replace(/\./g,"[.]").replace(/\?/g,"[?]")) != null) {
          tmp_array.push(sentence_pairs[j]);
        }
      }
    }
    anadiplosis_view.push(tmp_array);
  }

  anadiplosis_range = [];
  for(i=0; i<anadiplosis_examples.length; i++) {
    for(j=0; j<anadiplosis_view[i].length; j++) {
      let range = [];
      for(t=0; t<sentence_pairs_range.length; t++) {
        if(sentence_pairs_range[t][0] == anadiplosis_view[i][j]){
          range = sentence_pairs_range[t][1];
        }
      }
      if(range.length == 0) {
        for(t=0; t<sentences_range.length; t++) {
          if(sentences_range[t][0] == anadiplosis_view[i][j]){
            range = sentence_pairs_range[t][1];
          }
        }
      }
      let words_numbers = [];
      for(t=range[0]; t<range[1]; t++) {
        let temp_str = "";
        if(text_words[t].match(/[,'"]/) != null) {
          temp_str = text_words[t].substring(0, (text_words[t].match(/[,'"]/)).index).replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\?/g,"[?]");
        }
        else {
          if(text_words[t].indexOf("`") != -1) {
            temp_str = text_words[t].substring(text_words[t].indexOf("`")+1).replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\?/g,"[?]");
          }
          else {
            temp_str = text_words[t].replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\?/g,"[?]");
          }
        }
        let temp_reg = new RegExp("\\s"+temp_str+"\\s|\\s"+temp_str+"|"+temp_str+"\\s","gi");
        if(anadiplosis_examples[i].match(temp_reg) != null || anadiplosis_examples[i].match(temp_reg) != null || anadiplosis_examples[i].toLowerCase() == text_words[t].toLowerCase()) {
          words_numbers.push(t);
        }
      }
      anadiplosis_range.push({"type": "anadiplosis", "words": words_numbers, "context": range})
    }
  }
}

function getSRepeatsRanges() {
  srepeat_range = [];
  for(i=0; i<srepeat_examples.length; i++) {
    if(srepeat_examples[i][1].length != 0) {
      let range = [];
      for(t=0; t<sentences_range.length; t++){
        if(sentences_range[t][0] == srepeat_examples[i][0]) {
          range = sentences_range[t][1];
        }
      }
      let words_numbers = [];
      for(t=range[0]; t<range[1]; t++) {
        let temp_str = text_words[t].replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\?/g,"[?]");
        let temp_reg = new RegExp("\\s"+temp_str+"\\s|\\s"+temp_str+"|"+temp_str+"\\s","gi")
        for(p=0; p<srepeat_examples[i][1].length; p++) {
          if(srepeat_examples[i][1][p].match(temp_reg) != null || srepeat_examples[i][1][p].match(temp_reg) != null || srepeat_examples[i][1][p].toLowerCase() == text_words[t].toLowerCase()) {
            words_numbers.push(t);
          }
        }
      }
      if(words_numbers.length > 1){
        srepeat_range.push({"type": "simple repeat", "words": words_numbers, "context": range});
      }
    }
  }
}

function getMunionRange() {
  munion_range = [];
  let signs = [",",".","!","?","...","!..","?..."];
  for(i=0; i<multiunion_examples.length; i++) {
    let range = [];
    for(t=0; t<sentences_range.length; t++) {
      if(sentences_range[t][0] == multiunion_examples[i][0]) {
        range.push(sentences_range[t][1][0]);
        range.push(sentences_range[t][1][1]);
      }
    }
    let words_numbers = [];
    for(t=range[0];t<range[1];t++) {
      let temp_str = text_words[t];
      let temp_reg = "";
      if(signs.indexOf(text_words[t][text_words[t].length-1]) != -1) {
        temp_str = temp_str.substring(0,temp_str.length-1);
      }
      temp_str = temp_str.replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\?/g,"[?]");
      temp_reg = new RegExp("\\s"+temp_str+"\\s|\\s"+temp_str+"|"+temp_str+"\\s","g");
      for(p=0; p<multiunion_examples[i][1].length; p++) {
        if(multiunion_examples[i][1][p].match(temp_reg) != null
        || multiunion_examples[i][1][p].toLowerCase() == text_words[t].toLowerCase()) {
          words_numbers.push(t);
        }
      }
    }
    if(words_numbers.length > 1) {
      munion_range.push({"type": "multi union", "words": words_numbers, "context": range});
    }
  }
  for(i=0; i <multiunion_pairs_examples.length; i++) {
    let range = [];
    for(t=0; t<sentences_range.length; t++) {
      if(sentences_range[t][0] == multiunion_pairs_examples[i][0]) {
        range.push(sentences_range[t][1][0]);
        range.push(sentences_range[t][1][1]);
      }
    }
    let words_numbers = [];
    for(t=range[0];t<range[1];t++) {
      let temp_str = text_words[t].replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\?/g,"[?]");
      let temp_reg = "";
      if(signs.indexOf(text_words[t][text_words[t].length-1]) != -1) {
        temp_str = temp_str.substring(0,temp_str.length-1);
      }
      temp_reg = new RegExp("\\s"+temp_str+"\\s|\\s"+temp_str+"|"+temp_str+"\\s","g");
      for(p=0; p<multiunion_pairs_examples[i][2].length; p++) {
        if(multiunion_pairs_examples[i][2][p].match(temp_reg) != null
        || multiunion_pairs_examples[i][2][p].toLowerCase() == text_words[t].toLowerCase()) {
          if(words_numbers.indexOf(t) == -1 && multiunion_pairs_examples[i][2][p].match(text_words[t-1] + " " + text_words[t] + " " + text_words[t+1]) != null) {
            words_numbers.push(t);
          }
        }
      }
    }
    if(words_numbers.length > 1) {
      munion_range.push({"type": "multi union", "words": words_numbers, "context": range});
    }
  }
}

function getAposiopesisRanges() {
  aposiopesis_range = [];
  for(i=0; i<aposiopesis_examples.length; i++) {
    let range = [];
    range = [sentences_range[aposiopesis_examples[i][2][0]][1][0], sentences_range[aposiopesis_examples[i][2][1]][1][1]];
    aposiopesis_range.push({"type": "aposiopesis", "words": range, "context":range})
  }
}

function prepareDataToJSON() {
  document.title = "IN PROGRESS";
  getSentencesRanges();
  getAnaphorasRanges();
  getEpiphorasRanges();
  getSimplokasRanges();
  getAnadiplosisRanges();
  getSRepeatsRanges();
  getMunionRange();
  getAposiopesisRanges();

  output_data = [];
  for(key in anaphoras_range) {
    output_data.push(anaphoras_range[key]);
  }
  for(key in epiphoras_range) {
    output_data.push(epiphoras_range[key]);
  }
  for(key in simploka_range) {
    output_data.push(simploka_range[key]);
  }
  for(key in anadiplosis_range) {
    output_data.push(anadiplosis_range[key]);
  }
  for(key in srepeat_range) {
    output_data.push(srepeat_range[key]);
  }
  for(key in munion_range) {
    output_data.push(munion_range[key]);
  }
  for(key in aposiopesis_range) {
    output_data.push(aposiopesis_range[key]);
  }

  json_data = { "feature": output_data};

  load_json.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json_data));
  load_json.download = file_title.textContent + ".json";
  document.title = "DONE";
}
