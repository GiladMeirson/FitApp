const init = () => {
  ref = firebase.database().ref("History");
  isTrainNow = false;
  TrainStartTime = 0;
  CurrentTrain = {};
  CurrentTrain.Ex = [];
  CurrentDirect = 0;
  TempoEx = [];
  TimerSetInterval = 0;
  TimerRestInterval = 0;
  CurrentIndexEX = 0;
  CurrentEffortEX = 0;
  CurrentSet = 0;
  CurrentWeight = 25;
  CurrentPlan = GetCurrentPlan();
  //console.log(CurrentPlan);
};

/* Get into full screen */
function requestFullScreen(element) {
  // Supports most browsers and their versions.
  var requestMethod =
    element.requestFullScreen ||
    element.webkitRequestFullScreen ||
    element.mozRequestFullScreen ||
    element.msRequestFullScreen;

  if (requestMethod) {
    // Native full screen.
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") {
    // Older IE.
    var wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

//right know return a plan by order
//with amount of ex by the config json in the data base
const GetCurrentPlan = () => {
  const config = firebase.database().ref("config");
  config.on("value", (snapshot) => {
    const data = snapshot.val();

    CurrentConfig = data;
    let ResArray = [];
    const tempArr = {};
    if (CurrentConfig.Type == "full body") {
      // console.log(CurrentConfig);
      for (const k in CurrentConfig) {
        if (CurrentConfig[k] != "full body") {
          let counter = 0;

          if (tempArr[k] == undefined) {
            tempArr[k] = [];
          }
          while (counter < CurrentConfig[k]) {
            let ExIndex = Math.floor(Math.random() * Plan["Bank"].Ex[k].length);
            let ExId = Plan["Bank"].Ex[k][ExIndex].id;
            if (ResArray.includes(ExId) == false) {
              ResArray.push(Plan["Bank"].Ex[k][ExIndex]);
              tempArr[k].push(Plan["Bank"].Ex[k][ExIndex]);
              counter++;
            } else {
              ExIndex = Math.floor(Math.random() * Plan["Bank"].Ex[k].length);
              ExId = Plan["Bank"].Ex[k][ExIndex].id;
            }
          }
        }
      }
      // console.log(tempArr);
      ResArray = {};
      ResArray.Ex = [];
      // console.log(ResArray);
      for (let i = 0; i < tempArr.Legs.length; i++) {
        const ex = tempArr.Legs[i];
        ResArray.Ex.push(ex);
      }
      for (let i = 0; i < tempArr.Back.length; i++) {
        const ex = tempArr.Back[i];
        ResArray.Ex.push(ex);
      }
      for (let i = 0; i < tempArr.Chest.length; i++) {
        const ex = tempArr.Chest[i];
        ResArray.Ex.push(ex);
      }
      for (let i = 0; i < tempArr.Deltoid.length; i++) {
        const ex = tempArr.Deltoid[i];
        ResArray.Ex.push(ex);
      }
      for (let i = 0; i < tempArr.Triceps.length; i++) {
        const ex = tempArr.Triceps[i];
        ResArray.Ex.push(ex);
      }
      for (let i = 0; i < tempArr.Biceps.length; i++) {
        const ex = tempArr.Biceps[i];
        ResArray.Ex.push(ex);
      }
      // console.log(ResArray);
      CurrentPlan = ResArray;
      console.log(CurrentPlan);
      $('#firstExTitle').text(`The first Ex is : ${CurrentPlan.Ex[0].name}`)
      return CurrentPlan;
    }

    if (CurrentConfig.Type=='A-B') {
      
    }
  });
};

//when click the start btn -> start plan !
const StartTrain = () => {
  requestFullScreen(document.body);
  $("#start-container").fadeOut(250, () => {
    isTrainNow = true;
    TrainStartTime = new Date();
    //start plan set 1 !
    CurrentSet = 1;
    // console.log(CurrentPlan);
    if (CurrentPlan != undefined) {
      RenderEX(CurrentPlan.Ex[CurrentIndexEX],CurrentPlan.Ex[CurrentIndexEX+1]);
    } else {
      setTimeout(() => {
        RenderEX(CurrentPlan.Ex[CurrentIndexEX],CurrentPlan.Ex[CurrentIndexEX+1]);
      }, 250);
    }
  });
};

const RenderTimerSet = (start, flag = true) => {
  let res = timeDiff(start, new Date());
  if (flag) {
    document.getElementById(
      "time-title"
    ).innerHTML = `Time: ${res.hours}:${res.minutes}:${res.seconds}`;
  } else {
    document.getElementById(
      "rest-time-title"
    ).innerHTML = `${res.minutes}:${res.seconds}`;
  }
};

//scale 1-7 how hard it was
const ClickOnImgEffort = (img) => {
  // console.log(img.id.replace("I", ""));
  CurrentEffortEX = parseInt(img.id.replace("I", ""));
};
//Change Reps value input
const ChangeReps = (value, flag = true) => {
  if (flag) {
    document.getElementById("repsIN").value =
      parseInt(document.getElementById("repsIN").value) + value;
  } else {
    document.getElementById("weightIN").value =
      parseInt(document.getElementById("weightIN").value) + value;
  }
};

//when click return to set from rest
const SkipToSet = () => {
  $("#rest-container").fadeOut(200, () => {
    clearInterval(TimerRestInterval);
    CurrentSet++;
    if (CurrentSet > CurrentPlan.Ex[CurrentIndexEX].sets) {
      CurrentIndexEX++;
      CurrentSet = 1;
      CurrentTrain.Ex.push(TempoEx);
      TempoEx = [];
    }
    if (CurrentIndexEX >= CurrentPlan.Ex.length) {
      //finish train

      Swal.fire({
        title: "Do you want to save the Train?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire("Saved!", "", "success");
          isTrainNow = false;
          const report = FinishReport();
          CurrentTrain.Report = report;
          Save(CurrentTrain);

          return;
        } else if (result.isDenied) {
          Swal.fire("Train are not saved", "", "info");
          isTrainNow = false;
          return;
        }
      });
    } else {
      RenderEX(CurrentPlan.Ex[CurrentIndexEX],CurrentPlan.Ex[CurrentIndexEX+1]);
    }
  });
};

//when click the next btn
const NextClick = () => {
  let time = document
    .getElementById("time-title")
    .innerHTML.replace("Time: ", "");
  let timearr = time.split(":");
  let sumSec =
    parseInt(timearr[0]) * 60 * 60 +
    parseInt(timearr[1]) * 60 +
    parseInt(timearr[2]);
  console.log(timearr, sumSec);
  let exName = CurrentPlan.Ex[CurrentIndexEX].name;
  let exType = CurrentPlan.Ex[CurrentIndexEX].type;
  let Effort = CurrentEffortEX;
  let setNumber = CurrentSet;
  let reps = parseInt(document.getElementById("repsIN").value);
  CurrentWeight = document.getElementById("weightIN").value;
  clearInterval(TimerSetInterval);
  const FinishSet = {
    ExerciseName: exName,
    Score: CurrentPlan.Ex[CurrentIndexEX].score,
    ExerciseIndex: CurrentIndexEX,
    Type: exType,
    Time: time,
    Effort: Effort,
    SetNumber: setNumber,
    Weight: parseInt(CurrentWeight),
    Reps: reps,
    Seconds: sumSec,
    Rank:
      reps ** (1 + CurrentPlan.Ex[CurrentIndexEX].score) +
      (parseInt(CurrentWeight) ** Effort / 80 ** Effort) * sumSec +
      CurrentIndexEX ** setNumber / setNumber,
  };
  console.log(FinishSet);
  TempoEx.push(FinishSet);
  //Send to DB

  //Rest

  $("#train-form-container").fadeOut(200, () => {
    $("#rest-container").fadeIn(200, () => {
      let startTime = new Date();
      let Cset = CurrentSet;
      let C_ex_index = CurrentIndexEX;
      Cset++;
      
      if (Cset > CurrentPlan.Ex[C_ex_index].sets) {
        C_ex_index++;
        Cset = 1;
      }
      $('#C-set').text(`Next set: ${Cset}`)
      $('#C-Ex').text(`Next Ex: ${CurrentPlan.Ex[C_ex_index].name}`);
      TimerRestInterval = setInterval(RenderTimerSet, 1000, startTime, false);
    });
  });
};

const RenderEX = (ex,next) => {
  let nextStr = ``;
  
  if (next!=undefined && next!=null) {
    nextStr=next.name;
  }
  else {
    nextStr=`End`
  }
  let StartTimeSet = new Date();
  TimerSetInterval = setInterval(RenderTimerSet, 1000, StartTimeSet);
  let str = `
  <h2 id="time-title">Time: 00:00:00</h2>
  <h1>${ex.name}</h1>
  <p style="margin-bottom:20px; opacity:0.75; color:rgb(223, 190, 82);">${ex.type}</p>
  <p>Reps:</p>
  <div class="wrapReps">
  <input type="number" placeholder="reps ?" value="${ex.reps}"
      name="reps" id="repsIN">
  <div  class="up-down-btn wrap-C">
      <img onclick="ChangeReps(1)" src="./assets/up.png" alt>
      <img onclick="ChangeReps(-1)" src="./assets/down.png" alt>
  </div>
  </div>
  <p>Weight:</p>
  <div class="wrapReps">
  <input type="number" value="${CurrentWeight}"  placeholder="Weight (KG)"
  name="Weight" id="weightIN">
  <div  class=" up-down-btn wrap-C">
  <img ondblclick="ChangeReps(5,false)" onclick="ChangeReps(1,false)" src="./assets/up.png" alt>
  <img ondblclick="ChangeReps(-5,false)" onclick="ChangeReps(-1,false)" src="./assets/down.png" alt>
</div>
  </div>
  <p>Sets:</p>
  <input type="text" value="${CurrentSet}" disabled="true" name="set"
      id="setIN">
  <p style="margin-top: 4%;">was hard ?</p>
  <div id="dock-img">
      <img id="I1" onclick="ClickOnImgEffort(this)"
          src="./assets/1.png" alt>
      <img id="I2" onclick="ClickOnImgEffort(this)"
          src="./assets/2.png" alt>
      <img id="I3" onclick="ClickOnImgEffort(this)"
          src="./assets/3.png" alt>
      <img id="I4" onclick="ClickOnImgEffort(this)"
          src="./assets/4.png" alt>
      <img id="I5" onclick="ClickOnImgEffort(this)"
          src="./assets/5.png" alt>
      <img id="I6" onclick="ClickOnImgEffort(this)"
          src="./assets/6.png" alt>
      <img id="I7" onclick="ClickOnImgEffort(this)"
          src="./assets/7.png" alt>
  </div>
  <button
      style="margin-block: 10%; font-weight: 900; background-color: lightgreen;"
      class="btn-long d3-shadow" onclick="NextClick()">Next</button>
      <p style="font-size:16px; color:rgb(142, 81, 170); margin-block:5%;">Next Ex : ${nextStr}</p>
  `;

  document.getElementById("form1").innerHTML = str;
  $("#train-form-container").fadeIn(250);
};

const Navigators = (id) => {
  requestFullScreen(document.body);
  if (isTrainNow) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "leave!",
        cancelButtonText: "cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          isTrainNow=false;
          swalWithBootstrapButtons.fire(
            "Deleted!",
            "Your train has been deleted.",
            "success"
          );
          StupidNavigator(id);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your train file is safe :)",
            "error"
          );
        }
      });
  } else {
    StupidNavigator(id);
  }
};

const StupidNavigator = (id) => {
  if (id == "home") {
    $("#dashboard-main").fadeOut();
    $("#config-form-container").fadeOut();
    $("#resPH").fadeOut();
    $("#history-main").fadeOut();
    $("#train-form-container").fadeOut(100, () => {
      $("#rest-container").fadeOut(100, () => {
        $("#main").fadeIn();
        $("#start-container").fadeIn(200);
      });
    });
  } else if (id == "analysis") {
    $("#main").fadeOut();
    $("#res-ph").fadeOut();
    $("#history-main").fadeOut();
    $("#config-form-container").fadeOut();
    $("#dashboard-main").fadeIn();
   
  } else if (id == "history") {
    $("#main").fadeOut();
    $("#config-form-container").fadeOut();
    $("#resPH").fadeOut();
    $("#dashboard-main").fadeOut();
    $("#history-main").fadeIn();
  }
};

const ToConfig = () => {
  $("#start-container").fadeOut(200, () => {
    $("#config-form-container").fadeIn(100, () => {});
    DisplayPlan(CurrentConfig.Type,true);
  });
};
const DisplayPlan = (val, flagCurrent) => {
  console.log(val,flagCurrent)
  let str = ``;
  if (flagCurrent == false) {
    if (val == "full body") {
      str = `<hr>
      <h1>Full body</h1>
      <div class="wrap-R">
          <div class="wrap-C">
              <label for="Legs">Legs</label>
              <input type="number" value="0" name="Legs" id="LegsCheck">
          </div>
          <div class="wrap-C">
              <label for="Legs">Back</label>
              <input type="number" value="0" name="Back" id="BackCheck">
          </div>
          <div class="wrap-C">
              <label for="Legs">Chest</label>
              <input type="number" value="0" name="Chest" id="ChestCheck">
          </div>
          <div class="wrap-C">
              <label for="Legs">Deltoid</label>
              <input type="number" value="0" name="Deltoid" id="DeltoidCheck">
          </div>
          <div class="wrap-C">
              <label for="Legs">Triceps</label>
              <input type="number" value="0" name="Triceps" id="TricepsCheck">
          </div>
          <div class="wrap-C">
              <label for="Legs">Biceps</label>
              <input type="number" value="0" name="Biceps" id="BicepsCheck">
          </div>
      
          
      </div>`;
    } else if (val == "A-B") {
      str = `<hr>
    <h1>A</h1>
    <div class="wrap-R">
        <div class="wrap-C">
            <label for="Legs">Legs</label>
            <input type="number" value="0" name="Legs" id="LegsCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Back</label>
            <input type="number" value="0" name="Back" id="BackCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Chest</label>
            <input type="number" value="0" name="Chest" id="ChestCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Deltoid</label>
            <input type="number" value="0" name="Deltoid" id="DeltoidCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Triceps</label>
            <input type="number" value="0" name="Triceps" id="TricepsCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Biceps</label>
            <input type="number" value="0" name="Biceps" id="BicepsCheck">
        </div>
    
        
    </div>

    <hr>
    <h1>B</h1>
    <div class="wrap-R">
        <div class="wrap-C">
            <label for="Legs">Legs</label>
            <input type="number" value="0" name="Legs" id="LegsCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Back</label>
            <input type="number" value="0" name="Back" id="BackCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Chest</label>
            <input type="number" value="0" name="Chest" id="ChestCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Deltoid</label>
            <input type="number" value="0" name="Deltoid" id="DeltoidCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Triceps</label>
            <input type="number" value="0" name="Triceps" id="TricepsCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Biceps</label>
            <input type="number" value="0" name="Biceps" id="BicepsCheckB">
        </div>
    
        
    </div>`;
    } else if (val == "A-B-C") {
      str = `<hr>
    <h1>A</h1>
    <div class="wrap-R">
        <div class="wrap-C">
            <label for="Legs">Legs</label>
            <input type="number" value="0" name="Legs" id="LegsCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Back</label>
            <input type="number" value="0" name="Back" id="BackCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Chest</label>
            <input type="number" value="0" name="Chest" id="ChestCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Deltoid</label>
            <input type="number" value="0" name="Deltoid" id="DeltoidCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Triceps</label>
            <input type="number" value="0" name="Triceps" id="TricepsCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Biceps</label>
            <input type="number" value="0" name="Biceps" id="BicepsCheck">
        </div>
    
        
    </div>

    <hr>
    <h1>B</h1>
    <div class="wrap-R">
        <div class="wrap-C">
            <label for="Legs">Legs</label>
            <input type="number" value="0" name="Legs" id="LegsCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Back</label>
            <input type="number" value="0" name="Back" id="BackCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Chest</label>
            <input type="number" value="0" name="Chest" id="ChestCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Deltoid</label>
            <input type="number" value="0" name="Deltoid" id="DeltoidCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Triceps</label>
            <input type="number" value="0" name="Triceps" id="TricepsCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Biceps</label>
            <input type="number" value="0" name="Biceps" id="BicepsCheckB">
        </div>
    
        
    </div>
    <hr>
    <h1>C</h1>
    <div class="wrap-R">
        <div class="wrap-C">
            <label for="Legs">Legs</label>
            <input type="number" value="0" name="Legs" id="LegsCheckC">
        </div>
        <div class="wrap-C">
            <label for="Legs">Back</label>
            <input type="number" value="0" name="Back" id="BackCheckC">
        </div>
        <div class="wrap-C">
            <label for="Legs">Chest</label>
            <input type="number" value="0" name="Chest" id="ChestCheckC">
        </div>
        <div class="wrap-C">
            <label for="Legs">Deltoid</label>
            <input type="number" value="0" name="Deltoid" id="DeltoidCheckC">
        </div>
        <div class="wrap-C">
            <label for="Legs">Triceps</label>
            <input type="number" value="0" name="Triceps" id="TricepsCheckC">
        </div>
        <div class="wrap-C">
            <label for="Legs">Biceps</label>
            <input type="number" value="0" name="Biceps" id="BicepsCheckC">
        </div>
    
        
    </div>`;
    } else if (val == "-1") {
      //need
      console.log('yes');
      console.log(CurrentConfig.Type)
      DisplayPlan(CurrentConfig.Type,true);
      return;
    } else if (val == "Power") {
      alert("not yet");
    }
  } else {
    if (val == "full body") {
      console.log('im here')
      str = `<hr>
      <h1>Full body</h1>
      <div class="wrap-R">
          <div class="wrap-C">
              <label for="Legs">Legs</label>
              <input type="number" value="${CurrentConfig.Legs}" name="Legs" id="LegsCheck">
          </div>
          <div class="wrap-C">
              <label for="Legs">Back</label>
              <input type="number" value="${CurrentConfig.Back}" name="Back" id="BackCheck">
          </div>
          <div class="wrap-C">
              <label for="Legs">Chest</label>
              <input type="number" value="${CurrentConfig.Chest}" name="Chest" id="ChestCheck">
          </div>
          <div class="wrap-C">
              <label for="Legs">Deltoid</label>
              <input type="number" value="${CurrentConfig.Deltoid}" name="Deltoid" id="DeltoidCheck">
          </div>
          <div class="wrap-C">
              <label for="Legs">Triceps</label>
              <input type="number" value="${CurrentConfig.Triceps}" name="Triceps" id="TricepsCheck">
          </div>
          <div class="wrap-C">
              <label for="Legs">Biceps</label>
              <input type="number" value="${CurrentConfig.Biceps}" name="Biceps" id="BicepsCheck">
          </div>
      
          
      </div>`;
    } else if (val == "A-B") {
      str = `<hr>
    <h1>A</h1>
    <div class="wrap-R">
        <div class="wrap-C">
            <label for="Legs">Legs</label>
            <input type="number" value="0" name="Legs" id="LegsCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Back</label>
            <input type="number" value="0" name="Back" id="BackCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Chest</label>
            <input type="number" value="0" name="Chest" id="ChestCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Deltoid</label>
            <input type="number" value="0" name="Deltoid" id="DeltoidCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Triceps</label>
            <input type="number" value="0" name="Triceps" id="TricepsCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Biceps</label>
            <input type="number" value="0" name="Biceps" id="BicepsCheck">
        </div>
    
        
    </div>

    <hr>
    <h1>B</h1>
    <div class="wrap-R">
        <div class="wrap-C">
            <label for="Legs">Legs</label>
            <input type="number" value="0" name="Legs" id="LegsCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Back</label>
            <input type="number" value="0" name="Back" id="BackCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Chest</label>
            <input type="number" value="0" name="Chest" id="ChestCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Deltoid</label>
            <input type="number" value="0" name="Deltoid" id="DeltoidCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Triceps</label>
            <input type="number" value="0" name="Triceps" id="TricepsCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Biceps</label>
            <input type="number" value="0" name="Biceps" id="BicepsCheckB">
        </div>
    
        
    </div>`;
    } else if (val == "A-B-C") {
      str = `<hr>
    <h1>A</h1>
    <div class="wrap-R">
        <div class="wrap-C">
            <label for="Legs">Legs</label>
            <input type="number" value="0" name="Legs" id="LegsCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Back</label>
            <input type="number" value="0" name="Back" id="BackCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Chest</label>
            <input type="number" value="0" name="Chest" id="ChestCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Deltoid</label>
            <input type="number" value="0" name="Deltoid" id="DeltoidCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Triceps</label>
            <input type="number" value="0" name="Triceps" id="TricepsCheck">
        </div>
        <div class="wrap-C">
            <label for="Legs">Biceps</label>
            <input type="number" value="0" name="Biceps" id="BicepsCheck">
        </div>
    
        
    </div>

    <hr>
    <h1>B</h1>
    <div class="wrap-R">
        <div class="wrap-C">
            <label for="Legs">Legs</label>
            <input type="number" value="0" name="Legs" id="LegsCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Back</label>
            <input type="number" value="0" name="Back" id="BackCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Chest</label>
            <input type="number" value="0" name="Chest" id="ChestCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Deltoid</label>
            <input type="number" value="0" name="Deltoid" id="DeltoidCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Triceps</label>
            <input type="number" value="0" name="Triceps" id="TricepsCheckB">
        </div>
        <div class="wrap-C">
            <label for="Legs">Biceps</label>
            <input type="number" value="0" name="Biceps" id="BicepsCheckB">
        </div>
    
        
    </div>
    <hr>
    <h1>C</h1>
    <div class="wrap-R">
        <div class="wrap-C">
            <label for="Legs">Legs</label>
            <input type="number" value="0" name="Legs" id="LegsCheckC">
        </div>
        <div class="wrap-C">
            <label for="Legs">Back</label>
            <input type="number" value="0" name="Back" id="BackCheckC">
        </div>
        <div class="wrap-C">
            <label for="Legs">Chest</label>
            <input type="number" value="0" name="Chest" id="ChestCheckC">
        </div>
        <div class="wrap-C">
            <label for="Legs">Deltoid</label>
            <input type="number" value="0" name="Deltoid" id="DeltoidCheckC">
        </div>
        <div class="wrap-C">
            <label for="Legs">Triceps</label>
            <input type="number" value="0" name="Triceps" id="TricepsCheckC">
        </div>
        <div class="wrap-C">
            <label for="Legs">Biceps</label>
            <input type="number" value="0" name="Biceps" id="BicepsCheckC">
        </div>
    
        
    </div>`;
    } else if (val == "-1") {
      //need
      DisplayPlan(CurrentConfig.Type,true);
    } else if (val == "Power") {
      alert("not yet");
    }
  }
  document.getElementById('wrap-config-inputs').innerHTML=str;
};

const FinishReport = () => {
  console.log(CurrentTrain.Ex);
  let sumSecondsWorkTotal = 0;
  let TimediffBruto = timeDiff(TrainStartTime, new Date());
  let TimediffBrutoSECONDS =
    parseInt(TimediffBruto.hours) * 60 * 60 +
    parseInt(TimediffBruto.minutes) * 60 +
    parseInt(TimediffBruto.seconds);

  const Report = {
    Legs: 0,
    Back: 0,
    Chest: 0,
    Deltoid: 0,
    Triceps: 0,
    Biceps: 0,
  };
  for (let i = 0; i < CurrentTrain.Ex.length; i++) {
    const ex = CurrentTrain.Ex[i];
    for (let j = 0; j < ex.length; j++) {
      const set = ex[j];
      Report[set.Type] += set.Rank;
      sumSecondsWorkTotal += set.Seconds;
    }
  }
  let ResTimeSeconds = TimediffBrutoSECONDS - sumSecondsWorkTotal;

  let workH = Math.floor(sumSecondsWorkTotal / (60 * 60)); // hour
  let workM = Math.floor((sumSecondsWorkTotal % (60 * 60)) / 60); // min
  let workS = Math.floor((sumSecondsWorkTotal % (60 * 60)) % 60); //sec

  let restH = Math.floor(ResTimeSeconds / (60 * 60)); // hour
  let restM = Math.floor((ResTimeSeconds % (60 * 60)) / 60); // min
  let restS = Math.floor((ResTimeSeconds % (60 * 60)) % 60); //sec

  let str = `<h1>Finished</h1>
                    <div id="time-container">
                        <p class="titletimeRes" id="total-time">Total Time: ${
                          TimediffBruto.hours
                        }:${TimediffBruto.minutes}:${TimediffBruto.seconds}</p>
                        <p class="titletimeRes" id="work-time">Work Time: ${workH}:${workM}:${workS}</p>
                        <p class="titletimeRes" id="rest-time">Rest Time: ${restH}:${restM}:${restS}</p>
                    </div>
                    <div id="rank-container">
                        <p class="titleRes" id="number-sets">Legs Rank: ${roundD(
                          Report.Legs,
                          2
                        )}</p>
                        <p class="titleRes" id="number-sets">Back Rank: ${roundD(
                          Report.Back,
                          2
                        )}</p>
                        <p class="titleRes" id="number-sets">Chest Rank: ${roundD(
                          Report.Chest,
                          2
                        )}</p>
                        <p class="titleRes" id="number-sets">Deltoid Rank: ${roundD(
                          Report.Deltoid,
                          2
                        )}</p>
                        <p class="titleRes" id="number-sets">Triceps Rank: ${roundD(
                          Report.Triceps,
                          2
                        )}</p>
                        <p class="titleRes" id="number-sets">Biceps Rank: ${roundD(
                          Report.Biceps,
                          2
                        )}</p>
                    </div>`;

  document.getElementById("res-ph").innerHTML = str;
  $("#resPH").fadeIn();
  return Report;
  // <h1>Finished</h1>
  // <div id="time-container">
  //     <p class="titletimeRes" id="total-time">Total Time: 01:15:56</p>
  //     <p class="titletimeRes" id="work-time">Work Time: 00:35:36</p>
  //     <p class="titletimeRes" id="rest-time">Rest Time: 00:45:23</p>
  // </div>
  // <div id="rank-container">
  //     <p class="titleRes" id="number-sets">Legs Rank: 15</p>
  //     <p class="titleRes" id="number-sets">Back Rank: 51</p>
  //     <p class="titleRes" id="number-sets">Chest Rank: 34</p>
  //     <p class="titleRes" id="number-sets">Deltoid Rank: 532</p>
  //     <p class="titleRes" id="number-sets">Triceps Rank: 324</p>
  //     <p class="titleRes" id="number-sets">Biceps Rank: 34</p>
  // </div>
};

const SubmitPlanConfig = () =>{
  
}



//------------------fireBase------------------\\

const Save = (value) => {
  //value == train
  ref.child(getDate()).set(value);
};

const ReadFrom = (ref) => {
  const collection = firebase.database().ref(ref);
  collection.on("value", (snapshot) => {
    const data = snapshot.val();
    // console.log(data);
    DATA = data;
  });
};
