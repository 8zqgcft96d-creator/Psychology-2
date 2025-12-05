/* ---------- 題目資料 ---------- */
const questions = [
    {
        q: "1. 當你遇到新的挑戰時，你的第一反應是？",
        options: {
            A: "馬上跳進去、先試看看",
            B: "先觀察環境、研究方式",
            C: "有點猶豫、怕搞砸",
            D: "幫助他人、配合支援"
        }
    },
    {
        q: "2. 朋友需要幫忙時，你會？",
        options: {
            A: "鼓勵他們快起來做點事",
            B: "安靜陪伴、傾聽",
            C: "不太確定怎麼幫",
            D: "主動提供支援"
        }
    },
    {
        q: "3. 思考人生方向時，你偏好？",
        options: {
            A: "設定目標立刻行動",
            B: "深入思考、分析",
            C: "小心翼翼，慢慢走",
            D: "和他人分享、互相支持"
        }
    },
    {
        q: "4. 面對挫折時你的反應？",
        options: {
            A: "立刻反彈再戰",
            B: "自我反省、思考教訓",
            C: "沮喪、退縮、怕再犯",
            D: "尋求或提供支持"
        }
    },
    {
        q: "5. 你最看重的特質？",
        options: {
            A: "冒險精神 / 行動力",
            B: "思考深度 / 內在探索",
            C: "謹慎 / 安全感",
            D: "溫暖 / 支持他人"
        }
    }
];

/* ---------- 完整解析 ---------- */
const analysisText = {
    A: `
<h3>【馬型】</h3>
<p>你習慣當「載大家走過去」的人，你會扛責任、照顧別人。你讓人有安全感，但別忘了你也可以停下來、讓別人照顧你。</p>
    `,
    B: `
<h3>【男孩型】</h3>
<p>你有強烈感受力與好奇心，容易自我懷疑，但也因為真誠而讓人覺得安心。你不需要完美才值得被愛。</p>
    `,
    C: `
<h3>【狐狸型】</h3>
<p>你敏銳、細心，擅長判斷情緒與情勢。你慢熟且保護自己，但對真正信任的人非常忠誠。</p>
    `,
    D: `
<h3>【鼴鼠型】</h3>
<p>你溫柔、重視氣氛與小確幸，擅長照顧他人。記得也要把同樣的溫柔留給自己。</p>
    `
};

/* ---------- 狀態 ---------- */
let current = 0;
let counts = { A: 0, B: 0, C: 0, D: 0 };
let chart;

/* ---------- 初始化 ---------- */
window.onload = () => {
    loadQuestion();
};

/* ---------- 題目呈現 ---------- */
function loadQuestion() {
    const area = document.getElementById("quiz-area");

    if (current >= questions.length) {
        showResult();
        return;
    }

    const q = questions[current];

    area.innerHTML = `
        <div class="card">
            <h3>${q.q}</h3>
            ${Object.keys(q.options)
                .map(letter => 
                    `<button class="option-btn" onclick="selectOption('${letter}')">${letter}. ${q.options[letter]}</button>`
                )
                .join("")}

            <button onclick="nextQuestion()">下一題</button>
        </div>
    `;

    updateProgress();
}

/* ---------- 選項 ---------- */
let selected = null;

function selectOption(letter) {
    selected = letter;
    counts[letter]++;
}

/* ---------- 下一題 ---------- */
function nextQuestion() {
    if (!selected) {
        alert("請先選擇一個答案！");
        return;
    }

    selected = null;
    current++;
    loadQuestion();
}

/* ---------- 進度條 ---------- */
function updateProgress() {
    let percent = ((current) / questions.length) * 100;
    document.getElementById("progress-bar").style.width = percent + "%";
}

/* ---------- 結果 ---------- */
function showResult() {
    document.getElementById("quiz-area").style.display = "none";
    document.getElementById("result").style.display = "block";

    let maxScore = Math.max(...Object.values(counts));
    let topLetters = Object.keys(counts).filter(key => counts[key] === maxScore);

    // 顯示解析
    let analysisHTML = topLetters.map(l => analysisText[l]).join("<br><br>");
    document.getElementById("analysis").innerHTML = analysisHTML;

    drawRadar(topLetters);
}

/* ---------- 雷達圖 ---------- */
function drawRadar(highlights) {
    const ctx = document.getElementById("radarChart");

    const labels = ["馬(A)", "男孩(B)", "狐狸(C)", "鼴鼠(D)"];
    const dataArr = [counts.A, counts.B, counts.C, counts.D];

    // 多結果高亮
    const colors = {
        A: "rgba(255,99,132,0.8)",
        B: "rgba(54,162,235,0.8)",
        C: "rgba(255,206,86,0.8)",
        D: "rgba(75,192,192,0.8)"
    };

    const datasets = highlights.map(letter => ({
            label: `${letter} 類型`,
            data: dataArr,
            borderColor: colors[letter],
            backgroundColor: colors[letter].replace("0.8", "0.2"),
            borderWidth: 3
        })
    );

    chart = new Chart(ctx, {
        type: "radar",
        data: { labels, datasets },
        options: {
            scales: {
                r: {
                    suggestedMin: 0,
                    suggestedMax: 5,
                }
            }
        }
    });

    document.getElementById("download-btn").onclick = () => {
        const link = document.createElement("a");
        link.download = "你的測驗結果.png";
        link.href = chart.toBase64Image();
        link.click();
    };
}

/* ---------- 重新測驗 ---------- */
function restartQuiz() {
    current = 0;
    counts = { A: 0, B: 0, C: 0, D: 0 };
    selected = null;

    document.getElementById("result").style.display = "none";
    document.getElementById("quiz-area").style.display = "block";

    loadQuestion();
    updateProgress();
}
