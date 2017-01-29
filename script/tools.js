var Tools = {
  Array: {
    shuffle: function(array) {
      for (var i = 0; i < array.length; i++) {
        var rand = Tools.Random.range(0, array.length - 1);
        var temp_value = array[rand];
        array[rand] = array[i];
        array[i] = temp_value;
      }
      return array;
    },

    print: function(array) {
      var output = '[';
      for (var i = 0; i < array.length; i++) {
        if (i == array.length - 1) output += array[i] + ']';
        else output += array[i] + ', ';
      }
      console.log(output);
    }
  },

  Random: {
    range: function(low, high) {
      return Math.floor(Math.random() * (high - low + 1) + low);
    }
  }
}
