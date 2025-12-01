const questions = [
    { text: "1. 當你遇到一個新的挑戰時，你的第一反應是：",
      options: [
        { text: "（A） 馬上跳進去、先試看看", type: "馬" },
        { text: "（B） 先觀察環境、研究方式", type: "男孩" },
        { text: "（C） 有點猶豫、怕搞砸、先做部分準備", type: "狐狸" },
        { text: "（D） 幫助他人，在背後支撐或配合", type: "鼴鼠" }
      ]
    },
    { text: "2. 在朋友情緒低落時，你通常會：",
      options: [
        { text: "（A） 鼓勵他們「快起來、一起去做點什麼」", type: "馬" },
        { text: "（B） 安靜陪伴、傾聽他們説出來", type: "男孩" },
        { text: "（C） 不太確定怎麼幫比較好，會退縮", type: "狐狸" },
        { text: "（D） 主動照顧他們、給支持", type: "鼴鼠" }
      ]
    },
    { text: "3. 在思考人生方向時，你偏好：",
      options: [
        { text: "（A） 設定目標、立刻實踐", type: "馬" },
        { text: "（B） 深入思考、分析可能性", type: "男孩" },
        { text: "（C） 小心翼翼、怕錯、慢慢走", type: "狐狸" },
        { text: "（D） 與他人分享、互相支持", type: "鼴鼠" }
      ]
    },
    { text: "4. 面對失敗，你最可能的反應是：",
      options: [
        { text: "（A） 立刻反彈、再戰一次", type: "馬" },
        { text: "（B） 自我反省、思考教訓", type: "男孩" },
        { text: "（C） 沮喪、退縮、怕再犯錯", type: "狐狸" },
        { text: "（D） 尋求人際支持、一起面對", type: "鼴鼠" }
      ]
    },
    { text: "5. 你最看重的特質是：",
      options: [
        { text: "（A） 冒險精神／行動力", type: "馬" },
        { text: "（B） 思考深度／內在探索", type: "男孩" },
        { text: "（C） 謹慎／安全感", type: "狐狸" },
        { text: "（D） 溫暖／支持他人", type: "鼴鼠" }
      ]
    }
];

let index = 0;
let score = { 馬:0, 男孩:0, 狐狸:0, 鼴鼠:0 };

function loadQ() {
    const q = questions[index];
    document.getElementById("question").innerText = q.text;
    document.getElementById("options").innerHTML = q.options
        .map(o => `<button class="option" onclick="choose('${o.type}')">${o.text}</button>`)
        .join("");
}
loadQ();

function choose(type) {
    score[type]++;
    index++;
    if(index < questions.length) loadQ();
    else finish();
}

function finish() {
    document.getElementById("question-box").style.display = "none";
    document.getElementById("result").style.display = "block";

    const ctx = document.getElementById("radar").getContext("2d");
    const radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ["馬","男孩","狐狸","鼴鼠"],
            datasets: [{
                label:"你的特質分佈",
                data:[score.馬, score.男孩, score.狐狸, score.鼴鼠],
                borderWidth:2,
                backgroundColor: 'rgba(54,162,235,0.2)',
                borderColor:'rgba(54,162,235,1)'
            }]
        },
        options:{
            scales: { r:{ beginAtZero:true, min:0, max:5 } }
        }
    });

    // 下載圖表
    document.getElementById("downloadBtn").onclick = () => {
        const link = document.createElement('a');
        link.href = radarChart.toBase64Image();
        link.download = '心理測驗結果.png';
        link.click();
    }

    // 類型判定
    let entries = Object.entries(score);
    entries.sort((a,b)=>b[1]-a[1]);
    let top = entries.filter(e=>e[1]===entries[0][1]).map(e=>e[0]);
    document.getElementById("finalType").innerHTML = `<h3>你的類型：${top.join("＋")}</h3>`;

    // 完整解析
    const detail = {
        男孩:`你是【男孩型】：\n關於自己，你還在學著怎麼相信。\n你的樣子...\n(完整解析內容同前)`,

        鼴鼠:`你是【鼴鼠型】：\n你的溫柔，是世界很需要的安慰...\n(完整解析內容同前)`,

        狐狸:`你是【狐狸型】：\n你看得很清楚，只是習慣把心收好...\n(完整解析內容同前)`,

        馬:`你是【馬型】：\n你習慣當那個「載大家走過去」的人...\n(完整解析內容同前)`
    };

    document.getElementById("analysis").innerHTML =
        top.map(t => `<h3>${t}型解析</h3><p>${detail[t]}</p>`).join("");
}
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<title>心理測驗</title>
<style>
  body { font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial; background:#f5f5f5; padding:20px;}
  .container { max-width:600px; margin:auto; }
  .card { background:white; border-radius:12px; padding:20px; margin-bottom:20px; box-shadow:0 2px 6px rgba(0,0,0,0.1);}
  .btn { background:#1976d2; color:white; border:none; padding:10px 15px; border-radius:8px; cursor:pointer;}
  .btn:disabled { background:#aaa; cursor:default;}
  .progress-bar { background:#ddd; border-radius:8px; height:16px; overflow:hidden; margin-bottom:20px;}
  .progress-fill { height:100%; width:0%; background:#1976d2; transition: width 0.3s;}
</style>
</head>
<body>
<div class="container">
  <h1>心理測驗</h1>
  <div class="progress-bar">
    <div class="progress-fill" id="progressFill"></div>
  </div>

  <div id="quizContainer" class="card">
    <!-- 題目會在這裡生成 -->
  </div>

  <button id="nextBtn" class="btn" disabled>下一題</button>

  <div id="resultContainer" class="card" style="display:none;">
    <h2>測驗結果</h2>
    <canvas id="radarChart" width="400" height="400"></canvas>
    <div id="explanation" style="margin-top:15px;"></div>
    <button id="downloadBtn" class="btn">下載圖表</button>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
const questions = [
  { text: "當你遇到新的挑戰，你會？", choices:["馬上試","先觀察","猶豫準備","幫助他人"], key:'A' },
  { text: "朋友需要幫忙，你會？", choices:["鼓勵","安靜傾聽","退縮","提供後勤"], key:'B' },
  { text: "思考人生方向，你偏好？", choices:["立刻行動","深入分析","小心慢走","互相支持"], key:'C' },
  { text: "面對失敗，你最可能？", choices:["再戰","反省","退縮","尋求支持"], key:'D' },
  { text: "你最看重的特質？", choices:["冒險/行動力","思考深度","謹慎/安全感","溫暖/支持他人"], key:'D' }
];

const types = ['馬型','男孩型','狐狸型','鼴鼠型'];
const explanations = {
  "馬型":"你習慣當那個「載大家走過去」的人，會先撐住局面，也會累，但依然勇敢向前...",
  "男孩型":"你還在學著相信自己，有強烈感受力，容易看到別人情緒，也忽略自己需求...",
  "狐狸型":"你敏銳細心，習慣把心收好，忠誠且有義氣，但保持界線，不輕易交付自己...",
  "鼴鼠型":"你很重視舒適感與陪伴，溫柔體貼，給人安全感，也需要學會照顧自己..."
};

let currentQ = 0;
let answers = [];

function renderQuestion(){
  const q = questions[currentQ];
  let html = `<p>${q.text}</p>`;
  q.choices.forEach((c,i)=>{
    html += `<label><input type="radio" name="answer" value="${i}"> ${c}</label><br>`;
  });
  document.getElementById('quizContainer').innerHTML = html;
  document.getElementById('nextBtn').disabled = true;

  // 監聽選擇
  document.querySelectorAll('input[name="answer"]').forEach(inp=>{
    inp.addEventListener('change', ()=>{ document.getElementById('nextBtn').disabled = false; });
  });

  // 更新進度
  const percent = (currentQ / questions.length) * 100;
  document.getElementById('progressFill').style.width = percent + '%';
}

document.getElementById('nextBtn').addEventListener('click', ()=>{
  const selected = document.querySelector('input[name="answer"]:checked');
  if(selected) {
    answers.push(parseInt(selected.value));
    currentQ++;
    if(currentQ < questions.length){
      renderQuestion();
    } else {
      showResult();
    }
  }
});

function showResult(){
  document.getElementById('quizContainer').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('progressFill').style.width = '100%';
  document.getElementById('resultContainer').style.display = 'block';

  // 計算類型 (簡單示範，每個題目對應一種人格)
  let scores = { '馬型':0,'男孩型':0,'狐狸型':0,'鼴鼠型':0 };
  answers.forEach((a,i)=>{
    const type = types[a]; 
    scores[type]++;
  });

  const data = {
    labels: types,
    datasets: [{
      label: '人格特質分數',
      data: types.map(t=>scores[t]),
      fill:true,
      backgroundColor:'rgba(25,118,210,0.2)',
      borderColor:'rgba(25,118,210,1)',
      pointBackgroundColor:'rgba(25,118,210,1)'
    }]
  };

  const config = {
    type:'radar',
    data:data,
    options:{ scales:{ r:{ beginAtZero:true, max:questions.length } } }
  };

  const ctx = document.getElementById('radarChart').getContext('2d');
  const radarChart = new Chart(ctx, config);

  // 顯示解析
  const mainType = Object.keys(scores).reduce((a,b)=> scores[a]>=scores[b]?a:b );
  document.getElementById('explanation').innerText = explanations[mainType];

  // 下載圖表
  document.getElementById('downloadBtn').addEventListener('click', ()=>{
    const link = document.createElement('a');
    link.href = radarChart.toBase64Image();
    link.download = 'radar_chart.png';
    link.click();
  });
}

// 初始渲染
renderQuestion();
</script>
</body>
</html>
