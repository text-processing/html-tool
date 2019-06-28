//All functions in this file are responsible for displaying the results of calculations on a screen with highlighting of lexical aspects in the respective examples.

var anadiplosis_checker = [],
    srepeat_view = [],
    srepeat_checker = [],
    epiphora_checker = [],
    simploka_view = [],
    munion_view = [],
    banned_words = ["p", "<p>", "</p>", "'", '"'];

function createWordList(content){
  var text = content.replace(/[^a-zA-Zа-яА-ЯёЁ \n']/g, " ");
  text = text.replace(/\s+/g, " ");
  text = text.toLowerCase();
  text = text.substring(0,text.length-1);
  text = text.split(" ");

  var result = text.reduce(function (acc, el) {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});

  result = sortProps(result);

  for(key in result) {
    flag = true;
    for(i=0; i<banned_words.length; i++){
      if(key == banned_words[i]){
        flag = false;
        break;
      }
    }
    if(flag) {
      tableItem = [
        document.createElement('tr'),
        document.createElement('td'),
        document.createElement('td'),
        document.createElement('a'),
        document.createElement('td'),
        document.createElement('a')
      ]
      tableItem[3].textContent = key;
      tableItem[3].onclick = function(){
        brighter(this.textContent, '');
      };
      tableItem[1].appendChild(tableItem[3]);
      tableItem[2].textContent = result[key];
      tableItem[1].style.setProperty("width", "50%");
      tableItem[2].style.setProperty("width", "50%");
      tableItem[0].appendChild(tableItem[1]);
      tableItem[0].appendChild(tableItem[2]);
      words.appendChild(tableItem[0]);

      item = document.createElement('option');
      item.textContent = key;
      keywords.appendChild(item);
    }
  }
}

function sortProps(result) {
  var temp=[];
  for(key in result) {
    temp.push([key, result[key]]);
  }
  temp.sort(function(a,b){
    return b[1] - a[1];
  });
  var temp_result = {};
  for(i=0;i<temp.length;i++){
    temp_result[temp[i][0]] = temp[i][1];
  }
  return temp_result;
}

function createWordListBanned(content, banlist){
  var text = content.replace(/[^a-zA-Zа-яА-ЯёЁ \n']/g, " ");
  text = text.replace(/\s+/g, " ");
  text = text.toLowerCase();
  text = text.substring(0,text.length-1);
  text = text.split(" ");
  banlist = banlist.toLowerCase();
  banlist = banlist.split(" ");

  var result = text.reduce(function (acc, el) {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});

  result = sortProps(result);

  for(key in result) {
    flag = true
    for(i=0; i<banlist.length;i++){
      if(key == banlist[i]){
        flag = false;
        break;
      }
    }
    for(i=0; i<banned_words.length; i++){
      if(key == banned_words[i]){
        flag = false;
        break;
      }
    }
    if (flag) {
      tableItem = [
        document.createElement('tr'),
        document.createElement('td'),
        document.createElement('td'),
        document.createElement('a')
      ]
      tableItem[3].textContent = key;
      tableItem[3].onclick = function(){
        brighter(this.textContent, '');
      };
      tableItem[1].appendChild(tableItem[3]);
      tableItem[2].textContent = result[key];
      tableItem[0].appendChild(tableItem[1]);
      tableItem[0].appendChild(tableItem[2]);
      words.appendChild(tableItem[0]);
    }
  }
}

function setAnaphorasForUser() {
  document.title = "IN PROGRESS";
  if((document.getElementById("anaphora_count")).textContent == "0") return;
  result_single = document.getElementById("results_single");
  result_single.innerHTML = "";
  
  for(i=0; i<anaphora_examples.length; i++) {
    let tmp = [];
    for(j=0; j<anaphora_examples[i][1].length; j++) {
      if(anaphora_examples[i].length > 2)
        tmp.push(anaphora_examples[i][2][j]);
      else
        tmp.push(anaphora_examples[i][1][j]);
      anaphora_examples[i][1][j] = tmp[j].replace(anaphora_examples[i][0], '<a class="brighter-lightgreen">'+anaphora_examples[i][0]+'</a>')
      anaphora_reg = new RegExp("[^a-zA-Zа-яА-ЯёЁ()]\\s"+anaphora_examples[i][0].toLowerCase().replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\?/g,"[?]") + "[^a-zA-Zа-яА-ЯёЁ]");
      while (anaphora_examples[i][1][j].match(anaphora_reg) != null) {
        search_result = anaphora_examples[i][1][j].match(anaphora_reg)[0];
        current_sign = search_result[0];
        last_symbol = search_result[search_result.length-1];
        anaphora_examples[i][1][j] = anaphora_examples[i][1][j].replace(anaphora_reg, current_sign + " " + '<a class="brighter-lightgreen">'+anaphora_examples[i][0].toLowerCase()+'</a>' + last_symbol);
      }
    }
    anaphora_examples[i][2] = tmp;
  }
  
  result_single.innerHTML = "<h3>Anaphora's examples:</h3>";
  for(i=0; i<anaphora_examples.length; i++) {
    tempStr = "";
    tempStr += '<div id="an_example'+(i+1)+'" onclick="brightAnaphora('+(i+1)+');" style="cursor: pointer;">';
    tempStr += '<h5>'+(i+1)+'. "'+anaphora_examples[i][0]+'"</h5>';
    for(j=0; j<anaphora_examples[i][1].length; j++) {
      tempStr += "<p>"+ anaphora_examples[i][1][j] +"</p>";
    }
    tempStr += '</div>';
    result_single.innerHTML += tempStr;
  }
  document.title = "DONE";
}

function setEpiphorasForUser() {
  document.title = "IN PROGRESS";
  if((document.getElementById("epiphora_count")).textContent == "0") return;
  result_single = document.getElementById("results_single");
  result_single.innerHTML = "";
  for(i=0; i<epiphora_examples.length; i++) {
    let tmp = [];
    for(j=0; j<epiphora_examples[i][1].length; j++) {
      if(epiphora_examples[i].length > 2)
        tmp.push(epiphora_examples[i][2][j]);
      else
        tmp.push(epiphora_examples[i][1][j]);
      tmp_reg = new RegExp("(\\s|^)"+epiphora_examples[i][0].replace(/\./g,"[.]").replace(/\?/g,"[?]").replace(/\!/g,"[!]"));
      epiphora_examples[i][1][j] = epiphora_examples[i][1][j].replace(tmp_reg, ' <a class="brighter-gray">'+epiphora_examples[i][0]+'</a>');
    }
    epiphora_examples[i][2] = tmp;
  }
  
  result_single.innerHTML = "<h3>Epiphora's examples:</h3>";
  for(i=0; i<epiphora_examples.length; i++) {
    tempStr = "";
    tempStr += '<div id="ep_example'+(i+1)+'" onclick="brightEpiphora('+(i+1)+');" style="cursor: pointer;">';
    tempStr += '<h5>'+(i+1)+'. "'+epiphora_examples[i][0]+'"</h5>';
    for(j=0; j<epiphora_examples[i][1].length; j++) {
      tempStr += "<p>"+ epiphora_examples[i][1][j] +"</p>";
    }
    tempStr += '</div>';
    result_single.innerHTML += tempStr;
  }

  document.title = "DONE";
}

function setSimplokaForUser() {
  document.title = "IN PROGRESS";
  if((document.getElementById("simploka_count")).textContent == "0") return;
  result_single = document.getElementById("results_single");
  result_single.innerHTML = "";
  
  for(i=0; i<simploka_examples.length; i++) {
    let tmp = [];
    for(j=0; j<simploka_examples[i][1].length; j++) {
      if(simploka_examples[i].length > 3)
        tmp.push(simploka_examples[i][3][j]);
      else
        tmp.push(simploka_examples[i][1][j]);
      if(simploka_examples[i][0].match(/\s/g) != null && simploka_examples[i][2][j].match(/\s/g) != null && simploka_examples[i][1][j].match(/\s/g) != null){
        if(simploka_examples[i][1][j].match(/\s/g).length+1 <= (simploka_examples[i][0].match(/\s/g).length+1 + simploka_examples[i][2][j].match(/\s/g).length+1)) {
          simploka_examples[i][1][j] = '<a class="brighter-cyan">'+simploka_examples[i][1][j]+'</a>';
        }
        else {
          simploka_examples[i][1][j] = simploka_examples[i][1][j].replace(simploka_examples[i][0], '<a class="brighter-cyan">'+simploka_examples[i][0]+'</a>');
          simploka_examples[i][1][j] = simploka_examples[i][1][j].replace(simploka_examples[i][2], '<a class="brighter-cyan">'+simploka_examples[i][2]+'</a>');
        }
      }
      else {
        if(simploka_examples[i][0] == simploka_examples[i][2]) {
          simploka_examples[i][1][j] = '<a class="brighter-cyan">'+simploka_examples[i][1][j]+'</a>';
        }
        else {
          simploka_examples[i][1][j] = simploka_examples[i][1][j].replace(simploka_examples[i][0], '<a class="brighter-cyan">'+simploka_examples[i][0]+'</a>');
          simploka_examples[i][1][j] = simploka_examples[i][1][j].replace(simploka_examples[i][2], '<a class="brighter-cyan">'+simploka_examples[i][2]+'</a>');
        }
      }
    }
    simploka_examples[i][3] = tmp;
  }
  
  result_single.innerHTML = "<h3>Simploka's examples:</h3>";
  for(i=0; i<simploka_examples.length; i++) {
    tempStr = "";
    tempStr += '<div id="sp_example'+(i+1)+'" onclick="brightSimploka('+(i+1)+');" style="cursor: pointer;">';
    tempStr += '<h5>'+(i+1)+'. "'+simploka_examples[i][0]+'" and "'+simploka_examples[i][2]+'"</h5>';
    for(j=0; j<simploka_examples[i][1].length; j++) {
      tempStr += "<p>"+ simploka_examples[i][1][j] +"</p>";
    }
    tempStr += '</div>';
    result_single.innerHTML += tempStr;
  }
  document.title = "DONE";
}

function setAnadiplosisForUser() {
  document.title = "IN PROGRESS";
  anadiplosis_view = [];
  anadiplosis_checker = [];
  if((document.getElementById("anadiplosis_count")).textContent == "0") return;
  result_single = document.getElementById("results_single");
  result_single.innerHTML = "";
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
        let search_reg = new RegExp("[^a-zA-Zа-яА-ЯёЁ]"+anadiplosis_examples[i].replace(/\./g,"[.]").replace(/\?/g,"[?]"));
        if(sentence_pairs[j].match(search_reg) != null) {
          tmp_array.push(sentence_pairs[j]);
        }
      }
    }
    anadiplosis_view.push(tmp_array);
  }
  for(i=0; i<anadiplosis_view.length; i++) {
    tmp = [];
    for(j=0; j<anadiplosis_view[i].length; j++) {
      tmp.push(anadiplosis_view[i][j]);
      anadiplosis_view[i][j] = anadiplosis_view[i][j].replace(anadiplosis_examples[i], '<a class="brighter-pink">'+anadiplosis_examples[i]+'</a>');
    }
    anadiplosis_checker.push(tmp);
  }
  
  result_single.innerHTML = "<h3>Anadiplosis's examples:</h3>";
  for(i=0; i<anadiplosis_view.length; i++) {
    result_single.innerHTML += '<h5>'+(i+1)+'. "'+anadiplosis_examples[i]+'"</h5>';
    for(j=0; j<anadiplosis_view[i].length; j++) {
      result_single.innerHTML += '<div id="ad_example'+(i+1)+'_'+(j+1)+'" onclick="brightAnadiplosis('+(i+1)+','+(j+1)+');" style="cursor: pointer;"><p>'+ anadiplosis_view[i][j] +"</p></div>";
    }
  }
  document.title = "DONE";
}

function setSrepeatForUser() {
  document.title = "IN PROGRESS";
  if((document.getElementById("srepeat_count")).textContent == "0") return;
  result_single = document.getElementById("results_single");
  result_single.innerHTML = "";

  result_single.innerHTML = "<h3>Simple repeat examples:</h3>";
  count = 0;
  srepeat_view = [];
  for(i=0; i<srepeat_examples.length; i++) {
    for(j=0; j<srepeat_examples[i][1].length; j++) {
      count++;
      result_single.innerHTML += '<h5>'+count+'. "'+srepeat_examples[i][1][j]+'"</h5>';
      sentence = srepeat_examples[i][0];
      srepeat_checker.push(sentence);
      check_reg_one = new RegExp('(^'+srepeat_examples[i][1][j]+'[^a-zA-Zа-яА-ЯёЁ]|("|\\s)'+srepeat_examples[i][1][j]+'[^a-zA-Zа-яА-ЯёЁ]|\\s'+srepeat_examples[i][1][j]+'\\s)');
      tmp = srepeat_examples[i][1][j];
      tmp = (srepeat_examples[i][1][j][0]).toUpperCase() + srepeat_examples[i][1][j].substring(1);
      check_reg_two = new RegExp('(^'+tmp+'[^a-zA-Zа-яА-ЯёЁ]|("|\\s)'+tmp+'[^a-zA-Zа-яА-ЯёЁ]|\\s'+tmp+'\\s)');
      while(sentence.match(check_reg_one) != null) {
        last_symbol = "";
        first_symbol = "";
        replace_symbols = sentence.match(check_reg_one)[0];
        if(replace_symbols[0].match(/[a-zA-Zа-яА-ЯёЁ]/) != null) {
          last_symbol = replace_symbols[replace_symbols.length-1];
        }
        else {
          first_symbol = replace_symbols[0];
          last_symbol = replace_symbols[replace_symbols.length-1];
        }
        sentence = sentence.replace(check_reg_one, first_symbol+'<a class="brighter-lightblue">'+srepeat_examples[i][1][j]+'</a>'+last_symbol);
      }
      while(sentence.match(check_reg_two) != null) {
        last_symbol = "";
        first_symbol = "";
        replace_symbols = sentence.match(check_reg_two)[0];
        if(replace_symbols[0].match(/[a-zA-Zа-яА-ЯёЁ]/) != null) {
          last_symbol = replace_symbols[replace_symbols.length-1];
        }
        else {
          first_symbol = replace_symbols[0];
          last_symbol = replace_symbols[replace_symbols.length-1];
        }
        sentence = sentence.replace(check_reg_two, first_symbol+'<a class="brighter-lightblue">'+tmp+'</a>'+last_symbol);
      }
      srepeat_view.push(sentence);
      let index = srepeat_view.length - 1;
      result_single.innerHTML += '<div id="sr_example'+(index+1)+'" onclick="brightSrepeat('+(index+1)+');" style="cursor: pointer;"><p>' + sentence + "</p></div>";
    }
  }
  document.title = "DONE";
}

function setMunionForUser() {
  document.title = "IN PROGRESS";
  munion_view = [];
  if((document.getElementById("munion_count")).textContent == "0") return;
  result_single = document.getElementById("results_single");
  result_single.innerHTML = "";
  for(i=0; i<multiunion_examples.length; i++) {
    for(j=0; j<multiunion_examples[i][1].length; j++) {
      temp_reg = new RegExp("\\s"+multiunion_examples[i][1][j]+"\\s|\\s"+multiunion_examples[i][1][j]+"|"+multiunion_examples[i][1][j]+"\\s", "i");
      tmp = multiunion_examples[i][0];
      while(tmp.match(temp_reg) != null) {
        temp_res = tmp.match(temp_reg)[0];
        if(temp_res[0] == " ") {
          if(temp_res[temp_res.length-1] == " ") {
            tmp = tmp.replace(temp_reg, ' <a class="brighter-orange">'+multiunion_examples[i][1][j]+"</a> ");
          }
          else {
            tmp = tmp.replace(temp_reg, ' <a class="brighter-orange">'+multiunion_examples[i][1][j]+"</a>");
          }
        }
        else {
          if(temp_res[temp_res.length-1] == " ") {
            tmp = tmp.replace(temp_reg, '<a class="brighter-orange">'+multiunion_examples[i][1][j]+"</a> ");
          }
          else {
            tmp = tmp.replace(temp_reg, '<a class="brighter-orange">'+multiunion_examples[i][1][j]+"</a>");
          }
        }
      }
      temp_check_reg = new RegExp('\\S<a class="brighter-orange">'+multiunion_examples[i][1][j]+"</a>", "i");
      while(tmp.match(temp_check_reg) != null) {
        first_letter = tmp.match(temp_check_reg)[0][0];
        tmp = tmp.replace(temp_check_reg, first_letter+multiunion_examples[i][1][j]);
      }
      munion_view.push([tmp, multiunion_examples[i][1][j], multiunion_examples[i][0]]);
    }
  }
  for(i=0; i<multiunion_pairs_examples.length; i++) {
    tmp = multiunion_pairs_examples[i][0];
    for(j=0; j<multiunion_pairs_examples[i][2].length; j++) {
      tmp = tmp.replace(new RegExp(multiunion_pairs_examples[i][2][j], "gi"), '<a class="brighter-orange">'+multiunion_pairs_examples[i][2][j]+"</a>");
    }
    munion_view.push([tmp, multiunion_pairs_examples[i][1][0]+" ... "+multiunion_pairs_examples[i][1][1], multiunion_pairs_examples[i][0]]);
  }
  result_single.innerHTML = "<h3>Multi union examples:</h3>";
  for(i=0; i<munion_view.length; i++) {
    tempStr="";
    tempStr += '<div id="mu_example'+(i+1)+'" onclick="brightMunion('+(i+1)+');" style="cursor: pointer;">';
    tempStr += '<h5>'+(i+1)+'. "'+munion_view[i][1]+'"</h5>';
    tempStr += "<p>"+ munion_view[i][0] +"</p>";
    tempStr += '</div>';
    result_single.innerHTML += tempStr;
  }
  document.title = "DONE";
}

function setAposiopesisForUser() {
  document.title = "IN PROGRESS";
  if((document.getElementById("munion_count")).textContent == "0") return;
  result_single = document.getElementById("results_single");
  result_single.innerHTML = "";
  result_single.innerHTML = "<h3>Aposiopesis examples:</h3>";
  for(i=0; i<aposiopesis_examples.length; i++) {
    tempStr="";
    tempStr += '<div id="aposiopesis_example'+(i+1)+'" onclick="brightAposiopesis('+(i+1)+');" style="cursor: pointer;">';
    tempStr += '<h5>'+(i+1)+'.</h5>';
    tempStr += "<p>"+ aposiopesis_examples[i][0] + " " + aposiopesis_examples[i][1] + "</p>";
    tempStr += '</div>';
    result_single.innerHTML += tempStr;
  }
  document.title = "DONE";
}