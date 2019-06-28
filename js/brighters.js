//This function allows you to bright and word or sentence in text
function brighter(word) {
  document.title = "IN PROGRESS";
  newText = workarea.innerHTML;
  word_two = word.charAt(0).toUpperCase() + word.substr(1);
  re_one = '([^a-zA-Zа-яА-ЯёЁ<>/]|^)'+word+'([^a-zA-Zа-яА-ЯёЁ<>/]|$)';
  re_two = '([^a-zA-Zа-яА-ЯёЁ<>/]|^)'+word_two+'([^a-zA-Zа-яА-ЯёЁ<>/]|$)';
  re_one = new RegExp(re_one,'g');
  re_two = new RegExp(re_two,'g');
  
  newText = checkBrightedWord(newText, word);

  replace_string = ` <a class="brighter-yellow">!@$&@!</a> `;
  color_class = getColorClassForCurrentSelection();
  color_string = '<a class="brighter-yellow">\\n{0,1}[a-zA-Zа-яА-ЯёЁ]+(([^a-zA-Zа-яА-ЯёЁ]{0,1}\\s[a-zA-Zа-яА-ЯёЁ]+\\S{0,1})*|(\\S{0,1}))\\n{0,1}<\/a>';
  color_string = color_string.replace('brighter-yellow',color_class);
  re_color = new RegExp(color_string);
  while(newText.match(re_color) != null) {
    tmp = newText.match(re_color);
    tmp = tmp[0];
    tmp = tmp.match(/>\n{0,1}[a-zA-Zа-яА-ЯёЁ]+(([^a-zA-Zа-яА-ЯёЁ]{0,1}\s[a-zA-Zа-яА-ЯёЁ]+\S{0,1})*|(\S{0,1}))\n{0,1}</);
    tmp = tmp[0];
    tmp = tmp.substring(1, tmp.length - 1);
    newText = newText.replace(re_color, tmp);
  }
  replace_string = replace_string.replace('brighter-yellow', color_class);


  newText = newText.replace(re_one,replace_string);
  if(re_one.toString() != re_two.toString()){
    newText = newText.replace(re_two,replace_string);    
  }

  change_string = '<a class="brighter-yellow">!@[^a-zA-Zа-яА-ЯёЁ]{0,1}[a-zA-Zа-яА-ЯёЁ]+([^a-zA-Zа-яА-ЯёЁ]{0,1}\\s[a-zA-Zа-яА-ЯёЁ]+)*[^a-zA-Zа-яА-ЯёЁ]{0,2}@!<\/a>';
  change_string = change_string.replace('brighter-yellow', color_class);
  change_string = new RegExp(change_string);
  while(newText.match(/!@[^a-zA-Zа-яА-ЯёЁ]{0,1}[a-zA-Zа-яА-ЯёЁ]*([^a-zA-Zа-яА-ЯёЁ]{0,1}\s[a-zA-Zа-яА-ЯёЁ]+)*[^a-zA-Zа-яА-ЯёЁ]{0,2}@!/) != null) {
    tmp = newText.match(/!@[^a-zA-Zа-яА-ЯёЁ]{0,1}[a-zA-Zа-яА-ЯёЁ]*([^a-zA-Zа-яА-ЯёЁ]{0,1}\s[a-zA-Zа-яА-ЯёЁ]+)*[^a-zA-Zа-яА-ЯёЁ]{0,2}@!/);
    tmp = tmp[0];
    possible_comma = tmp.substring(tmp.length - 3, tmp.length - 2);
    possible_dash = tmp.substring(2,3);
    if(tmp.substring(2,3) == ' ' || tmp.substring(2,3) == '-' || tmp.substring(2,3) == '(' 
    || tmp.substring(2,3) == '«' || tmp.substring(2,3) == '"' || tmp.substring(2,3) ==">"
    || tmp.substring(2,3) == "'") {
      tmp = tmp.substring(3, tmp.length - 3); 
    }
    else {
      tmp = tmp.substring(2, tmp.length - 3);
    }
    sub_replace_string = replace_string.replace('!@$&@!', tmp);
    sub_replace_string = sub_replace_string.substring(1, sub_replace_string.length - 1);
    if(possible_comma != ' '){
      possible_comma = '</a>' + possible_comma;
      sub_replace_string = sub_replace_string.replace('</a>', possible_comma);
    }
    if(possible_dash == '-' || possible_dash == '(' || possible_dash == '«' 
    || possible_dash == '"' || possible_dash == ">" || possible_dash == "'"){
      possible_dash = possible_dash + '<a ';
      sub_replace_string = sub_replace_string.replace('<a ', possible_dash);
    }
    newText = newText.replace(change_string, sub_replace_string);
    fix_replace = sub_replace_string;
    if(sub_replace_string[0] == '-') {
      sub_replace_string = ' ' + sub_replace_string;
    }
    if(sub_replace_string[sub_replace_string.length-1] == '.' || sub_replace_string[sub_replace_string.length-1] == '-' || sub_replace_string[sub_replace_string.length-1] == "'") {
      if(sub_replace_string[sub_replace_string.length-1] == '-') {
        sub_replace_string = sub_replace_string + ' ';
      }
      else {
        sub_fix_string = sub_replace_string + '\\s\\W{0,2}';
        sub_fix_string = new RegExp(sub_fix_string.replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\./g,"[.]"));
        sub_fix_string = (newText.match(sub_fix_string))[0];
        if(sub_fix_string[sub_fix_string.length-1] == '.' || sub_fix_string[sub_fix_string.length-2] == "'") {
          sub_replace_string = sub_replace_string + ' ';
        }
      }
    }
    if(fix_replace != sub_replace_string) {
      newText = newText.replace(sub_replace_string, fix_replace);
    }
  }

  newText = newText.replace(/\s\s+/g, ' ');

  workarea.innerHTML = newText;
  document.title = "DONE";
}

//This function is responsible for selecting the color class for current selection
function getColorClassForCurrentSelection() {
  switch(text_color.value) {
    case 'Red':
      return 'brighter-red';
    case 'Yellow':
      return 'brighter-yellow';
    case 'Pink':
      return 'brighter-pink';
    case 'Green':
      return 'brighter-green';
    case 'Lightblue':
      return 'brighter-lightblue';
    case 'Orange':
      return 'brighter-orange';
    case 'Purple':
      return 'brighter-purple';
    case 'Gray':
      return 'brighter-gray';
    case 'Cyan':
      return 'brighter-cyan';
    case 'Lightgreen':
      return 'brighter-lightgreen';
    default:
      return 'brighter-yellow';
  }
}

//This function checks the brighted words in text and if necessary, replaces the color class to another one. 
function checkBrightedWord(textspace, checkword) {
  if(textspace.match('>'+checkword+'<') != null) {
    re_tmp = '<a class="\\S+">'+checkword+'</a>';
    re_tmp = new RegExp(re_tmp);
    tmp = textspace.match(re_tmp);
    tmp = tmp[0];
    tmp_class = tmp.match(/"\S+"/);
    tmp_class = tmp_class[0];
    tmp_class = tmp_class.substring(1, tmp_class.length - 1);

    color_string = '<a class="brighter-yellow">[a-zA-Zа-яА-ЯёЁ]+(([^a-zA-Zа-яА-ЯёЁ]{0,1}\\s[a-zA-Zа-яА-ЯёЁ]+[^a-zA-Zа-яА-ЯёЁ]{0,1})*|([^a-zA-Zа-яА-ЯёЁ]{0,1}))<\/a>';
    color_string = color_string.replace('brighter-yellow',tmp_class);
    re_color = new RegExp(color_string);
    while(textspace.match(re_color) != null) {
      tmp = textspace.match(re_color);
      tmp = tmp[0];
      tmp = tmp.match(/>[a-zA-Zа-яА-ЯёЁ]+([^a-zA-Zа-яА-ЯёЁ]{0,1}\s[a-zA-Zа-яА-ЯёЁ]+)*</);
      tmp = tmp[0];
      tmp = tmp.substring(1, tmp.length - 1);
      textspace = textspace.replace(re_color, tmp);
    }
    
  }
  return textspace
}

//This function clears any selections in text
function clearSelection() {
  newText = workarea.innerHTML;
  clear_str_1 = '<a class="\\S+">';
  clear_str_1 = new RegExp(clear_str_1, 'g');
  clear_str_2 = '<mark class="\\S+" id="\\S+">';
  clear_str_2 = new RegExp(clear_str_2, 'g');
  clear_str_3 = '<mark class="\\S+">';
  clear_str_3 = new RegExp(clear_str_3, 'g');
  newText = newText.replace(clear_str_1, '');
  newText = newText.replace(/<\/a>/g, '');
  newText = newText.replace(clear_str_2, '');
  newText = newText.replace(clear_str_3, '');
  newText = newText.replace(/<\/mark>/g, '');
  workarea.innerHTML = newText;
}

function mirror(str) {
  return str.replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\*/g, "[*]").replace(/\?/g,"[?]").replace(/\)/g, "[)]").replace(/\(/g,"[(]").replace(/\./g, "[.]");
}

//This function allows to bright anaphora in main text by clicking on it in results menu. Also this functions scrolls main text to selected anaphora.
function brightAnaphora(index) {
  index = index - 1;
  blockHtml = workarea.innerHTML;
  if(blockHtml.match('id="anaphora'+index+'"') != null) {
    return;
  }
  clearSelection();
  text = workarea.innerHTML;
  let replace_string = "";
  let replace_string_colored = "";
  for(i=0; i<anaphora_examples[index][2].length; i++) {
    if(i == 0) {
      let check_str_one = anaphora_examples[index][2][i] + "\n</p><p>\n</p><p>" + anaphora_examples[index][2][i+1];
      let check_str_two = anaphora_examples[index][2][i] + " " + anaphora_examples[index][2][i+1];
      let check_reg_one = new RegExp(mirror(check_str_one));
      let check_reg_two = new RegExp(mirror(check_str_two));
      if(text.match(check_reg_one) != null) {
        replace_string = anaphora_examples[index][2][i] + "\n</p><p>\n</p><p>" + anaphora_examples[index][2][i+1];
        replace_string_colored = '<mark class="termin-brighter" id="anaphora'+index+'">' + anaphora_examples[index][1][i] + '</mark>'
        + "\n</p><p>\n</p><p>" + '<mark class="termin-brighter">' + anaphora_examples[index][1][i+1];
      }
      else {
        if(text.match(check_reg_two) != null) {
          replace_string = anaphora_examples[index][2][i] + " " + anaphora_examples[index][2][i+1];
          if(i+1 == anaphora_examples[index][2].length - 1) {
            replace_string_colored = '<mark class="termin-brighter" id="anaphora'+index+'">' + anaphora_examples[index][1][i] + " " + anaphora_examples[index][1][i+1] + '</mark>';
          }
          else {
            replace_string_colored = '<mark class="termin-brighter" id="anaphora'+index+'">' + anaphora_examples[index][1][i] + " " + anaphora_examples[index][1][i+1];
          }
        }
      }
      i++;
    } 
    else {
      let check_str_one = replace_string + "\n</p><p>\n</p><p>" + anaphora_examples[index][2][i];
      let check_str_two = replace_string + " " + anaphora_examples[index][2][i];
      let check_reg_one = new RegExp(mirror(check_str_one));
      let check_reg_two = new RegExp(mirror(check_str_two));
      if(text.match(check_reg_one) != null) {
        replace_string += "\n</p><p>\n</p><p>" + anaphora_examples[index][2][i];
        if(i==anaphora_examples[index][2].length - 1) {
          replace_string_colored += "</mark>" + "\n</p><p>\n</p><p>" + '<mark class="termin-brighter">' + anaphora_examples[index][1][i] + '</mark>';
        }
        else {
          replace_string_colored += "</mark>" + "\n</p><p>\n</p><p>" + '<mark class="termin-brighter">' + anaphora_examples[index][1][i];
        }
      }
      else {
        if((text.match(check_reg_two) != null)) {
          replace_string += " " + anaphora_examples[index][2][i];
          if(i==anaphora_examples[index][2].length - 1) {
            replace_string_colored += " " + anaphora_examples[index][1][i] + '</mark>';
          }
          else {
            replace_string_colored += " " + anaphora_examples[index][1][i];
          }
        }
      }
    }
  }
  text = text.replace(replace_string, replace_string_colored);
  workarea.innerHTML= text;
  workarea.scrollTop = 0;
  var $to = $('#anaphora'+index);
  $('#workarea').animate({ scrollTop: ($to.offset().top-80), scrollLeft: $('#workarea').offset().left }, 500, 'swing');
}

//This function allows to bright epiphora in main text by clicking on it in results menu. Also this functions scrolls main text to selected epiphora.
function brightEpiphora(index) {
  index = index - 1;
  blockHtml = workarea.innerHTML;
  if(blockHtml.match('id="epiphora'+index+'"') != null) {
    return;
  }
  clearSelection();
  text = workarea.innerHTML;
  let replace_string = "";
  let replace_string_colored = "";
  for(i=0; i<epiphora_examples[index][2].length; i++) {
    if(i == 0) {
      let check_str_one = epiphora_examples[index][2][i] + "\n</p><p>\n</p><p>" + epiphora_examples[index][2][i+1];
      let check_str_two = epiphora_examples[index][2][i] + " " + epiphora_examples[index][2][i+1];
      let check_str_three = epiphora_examples[index][2][i] + "'\n</p><p>\n</p><p>" + epiphora_examples[index][2][i+1];
      let check_str_four = epiphora_examples[index][2][i] + "' " + epiphora_examples[index][2][i+1];
      let check_reg_one = new RegExp(mirror(check_str_one));
      let check_reg_two = new RegExp(mirror(check_str_two));
      let check_reg_three = new RegExp(mirror(check_str_three));
      let check_reg_four = new RegExp(mirror(check_str_four));
      if(text.match(check_reg_one) != null) {
        replace_string = epiphora_examples[index][2][i] + "\n</p><p>\n</p><p>" + epiphora_examples[index][2][i+1];
        if(i+1 == epiphora_examples[index][2].length - 1) {
          replace_string_colored = '<mark class="termin-brighter" id="epiphora'+index+'">' + epiphora_examples[index][1][i] + '</mark>'
          + "\n</p><p>\n</p><p>" + '<mark class="termin-brighter">' + epiphora_examples[index][1][i+1] + '</mark>';
        }
        else {
          replace_string_colored = '<mark class="termin-brighter" id="epiphora'+index+'">' + epiphora_examples[index][1][i] + '</mark>'
          + "\n</p><p>\n</p><p>" + '<mark class="termin-brighter">' + epiphora_examples[index][1][i+1];
        }
      }
      else {
        if(text.match(check_reg_two) != null) {
          replace_string = epiphora_examples[index][2][i] + " " + epiphora_examples[index][2][i+1];
          if(i+1 == epiphora_examples[index][2].length - 1) {
            replace_string_colored = '<mark class="termin-brighter" id="epiphora'+index+'">' + epiphora_examples[index][1][i] + " " + epiphora_examples[index][1][i+1] + '</mark>';
          }
          else {
            replace_string_colored = '<mark class="termin-brighter" id="epiphora'+index+'">' + epiphora_examples[index][1][i] + " " + epiphora_examples[index][1][i+1];
          }
        }
        else {
          if(text.match(check_reg_three) != null) {
            replace_string = epiphora_examples[index][2][i] + "'\n</p><p>\n</p><p>" + epiphora_examples[index][2][i+1];
            if(i+1 == epiphora_examples[index][2].length - 1) {
              replace_string_colored = '<mark class="termin-brighter" id="epiphora'+index+'">' + epiphora_examples[index][1][i] + '</mark>'
              + "'\n</p><p>\n</p><p>" + '<mark class="termin-brighter">' + epiphora_examples[index][1][i+1] + '</mark>';
            }
            else {
              replace_string_colored = '<mark class="termin-brighter" id="epiphora'+index+'">' + epiphora_examples[index][1][i] + '</mark>'
              + "'\n</p><p>\n</p><p>" + '<mark class="termin-brighter">' + epiphora_examples[index][1][i+1];
            }
          }
          else {
            if(text.match(check_reg_four) != null) {
              replace_string = epiphora_examples[index][2][i] + "' " + epiphora_examples[index][2][i+1];
              if(i+1 == epiphora_examples[index][2].length - 1) {
                replace_string_colored = '<mark class="termin-brighter" id="epiphora'+index+'">' + epiphora_examples[index][1][i] + "' " + epiphora_examples[index][1][i+1] + '</mark>';
              }
              else {
                replace_string_colored = '<mark class="termin-brighter" id="epiphora'+index+'">' + epiphora_examples[index][1][i] + "' " + epiphora_examples[index][1][i+1];
              }
            }
          }
        }
      }
      i++;
    } 
    else {
      let check_str_one = replace_string + "\n</p><p>\n</p><p>" + epiphora_examples[index][2][i];
      let check_str_two = replace_string + " " + epiphora_examples[index][2][i];
      let check_str_three = replace_string + "'\n</p><p>\n</p><p>" + epiphora_examples[index][2][i+1];
      let check_str_four = replace_string + "' " + epiphora_examples[index][2][i+1];
      let check_reg_one = new RegExp(mirror(check_str_one));
      let check_reg_two = new RegExp(mirror(check_str_two));
      let check_reg_three = new RegExp(mirror(check_str_three));
      let check_reg_four = new RegExp(mirror(check_str_four));
      if(text.match(check_reg_one) != null) {
        replace_string += "\n</p><p>\n</p><p>" + epiphora_examples[index][2][i];
        if(i==epiphora_examples[index][2].length - 1) {
          replace_string_colored += "</mark>" + "\n</p><p>\n</p><p>" + '<mark class="termin-brighter">' + epiphora_examples[index][1][i] + '</mark>';
        }
        else {
          replace_string_colored += "</mark>" + "\n</p><p>\n</p><p>" + '<mark class="termin-brighter">' + epiphora_examples[index][1][i];
        }
      }
      else {
        if(text.match(check_reg_two) != null) {
          replace_string += " " + epiphora_examples[index][2][i];
          if(i==epiphora_examples[index][2].length - 1) {
            replace_string_colored += " " + epiphora_examples[index][1][i] + '</mark>';
          }
          else {
            replace_string_colored += " " + epiphora_examples[index][1][i];
          }
        }
        else {
          if(text.match(check_reg_three) != null) {
            replace_string += "'\n</p><p>\n</p><p>" + epiphora_examples[index][2][i];
            if(i==epiphora_examples[index][2].length - 1) {
              replace_string_colored += "</mark>" + "'\n</p><p>\n</p><p>" + '<mark class="termin-brighter">' + epiphora_examples[index][1][i] + '</mark>';
            }
            else {
              replace_string_colored += "</mark>" + "'\n</p><p>\n</p><p>" + '<mark class="termin-brighter">' + epiphora_examples[index][1][i];
            }
          }
          else {
            if(text.match(check_reg_four) != null) {
              replace_string += "' " + epiphora_examples[index][2][i];
              if(i==epiphora_examples[index][2].length - 1) {
                replace_string_colored += "' " + epiphora_examples[index][1][i] + '</mark>';
              }
              else {
                replace_string_colored += "' " + epiphora_examples[index][1][i];
              }
            }
          }
        }
      }
    }
  }
  text = text.replace(replace_string, replace_string_colored);
  workarea.innerHTML= text;
  workarea.scrollTop = 0;
  var $to = $('#epiphora'+index);
  $('#workarea').animate({ scrollTop: ($to.offset().top-80), scrollLeft: $('#workarea').offset().left }, 500, 'swing');
}

//This function allows to bright simploka in main text by clicking on it in results menu. Also this functions scrolls main text to selected simploka.
function brightSimploka(index) {
  index = index - 1;
  blockHtml = workarea.innerHTML;
  if(blockHtml.match('id="simploka'+index+'"') != null) {
    return;
  }
  clearSelection();
  text = workarea.innerHTML;
  for(i=0; i<simploka_examples[index][3].length; i++) {
    if(i == 0) {
      if(text[text.match(simploka_examples[index][3][i+1]).index - 1] == ">" || text[text.match(simploka_examples[index][3][i+1]).index - 2] == ">") {
        text = text.replace(simploka_examples[index][3][i], '<mark class="termin-brighter" id="simploka'+index+'">' + simploka_examples[index][1][i] + '</mark>');
      }
      else {
        text = text.replace(simploka_examples[index][3][i], '<mark class="termin-brighter" id="simploka'+index+'">' + simploka_examples[index][1][i]);
      }
    }
    else {
      if(i == simploka_examples[index][3].length - 1) {
        if((text[text.match(simploka_examples[index][3][i]).index - 1] == ">" || text[text.match(simploka_examples[index][3][i]).index - 2] == ">")
          && text[text.match(simploka_examples[index][3][i]).index - 3] != "a") {
          text = text.replace(simploka_examples[index][3][i], '<mark class="termin-brighter">' + simploka_examples[index][1][i] + '</mark>');
        }
        else {
          text = text.replace(simploka_examples[index][3][i], simploka_examples[index][1][i] + '</mark>');
        }
      }
      else {
        if((text[text.match(simploka_examples[index][3][i]).index - 1] == ">" || text[text.match(simploka_examples[index][3][i]).index - 2] == ">")
          && text[text.match(simploka_examples[index][3][i]).index - 3] != "a") {
          text = text.replace(simploka_examples[index][3][i], '<mark class="termin-brighter">' + simploka_examples[index][1][i] + '</mark>');
        }
        else {
          text = text.replace(simploka_examples[index][3][i], simploka_examples[index][1][i]);
        }
      }
    }
  }
  workarea.innerHTML= text;
  workarea.scrollTop = 0;
  var $to = $('#simploka'+index);
  $('#workarea').animate({ scrollTop: ($to.offset().top-80), scrollLeft: $('#workarea').offset().left }, 500, 'swing');
}

//This function allows to bright anadiplosis in main text by clicking on it in results menu. Also this functions scrolls main text to selected anadiplosis.
function brightAnadiplosis(index, number) {
  index = index - 1;
  number = number - 1;
  blockHtml = workarea.innerHTML;
  if(blockHtml.match('id="anadiplosis'+index+'-'+number+'"') != null) {
    return;
  }
  clearSelection();
  text = workarea.innerHTML;
  text = text.replace(anadiplosis_checker[index][number], '<mark class="termin-brighter" id="anadiplosis'+index+'-'+number+'">' + anadiplosis_view[index][number] + '</mark>');
  workarea.innerHTML= text;
  workarea.scrollTop = 0;
  var $to = $('#anadiplosis'+index+'-'+number);
  $('#workarea').animate({ scrollTop: ($to.offset().top-80), scrollLeft: $('#workarea').offset().left }, 500, 'swing');
}

//This function allows to bright simple repeat in main text by clicking on it in results menu. Also this functions scrolls main text to selected simple repeat.
function brightSrepeat(index) {
  index = index - 1;
  blockHtml = workarea.innerHTML;
  if(blockHtml.match('id="srepeat'+index+'"') != null) {
    return;
  }
  clearSelection();
  text = workarea.innerHTML;
  text = text.replace(srepeat_checker[index], '<mark class="termin-brighter" id="srepeat'+index+'">' + srepeat_view[index] + '</mark>');
  workarea.innerHTML= text;
  workarea.scrollTop = 0;
  var $to = $('#srepeat'+index);
  $('#workarea').animate({ scrollTop: ($to.offset().top-80), scrollLeft: $('#workarea').offset().left }, 500, 'swing');
}

function brightMunion(index) {
  index = index - 1;
  blockHtml = workarea.innerHTML;
  if(blockHtml.match('id="munion'+index+'"') != null) {
    return;
  }
  clearSelection();
  text = workarea.innerHTML;
  text = text.replace(munion_view[index][2], '<mark class="termin-brighter" id="munion'+index+'">' + munion_view[index][0] + '</mark>');
  workarea.innerHTML= text;
  workarea.scrollTop = 0;
  var $to = $('#munion'+index);
  $('#workarea').animate({ scrollTop: ($to.offset().top-80), scrollLeft: $('#workarea').offset().left }, 500, 'swing');
}

function brightAposiopesis(index) {
  index = index - 1;
  blockHtml = workarea.innerHTML;
  if(blockHtml.match('id="aposiopesis'+index+'"') != null) {
    return;
  }
  clearSelection();
  text = workarea.innerHTML;
  replace_string = aposiopesis_examples[index][0] + " " + aposiopesis_examples[index][1];
  text = text.replace(replace_string, '<mark class="termin-brighter" id="aposiopesis'+index+'">' + replace_string + '</mark>');
  workarea.innerHTML= text;
  workarea.scrollTop = 0;
  var $to = $('#aposiopesis'+index);
  $('#workarea').animate({ scrollTop: ($to.offset().top-80), scrollLeft: $('#workarea').offset().left }, 500, 'swing');
}