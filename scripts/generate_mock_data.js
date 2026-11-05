const fs = require('fs');
const path = require('path');

// ==========================================
// 1. GENERATE post.sql (Mockaroo 1000 rows for Lab 4)
// ==========================================

const latinSentences = [
  "Vivamus in felis eu sapien cursus vestibulum. Proin eu mi.",
  "Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti.",
  "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.",
  "Mauris viverra diam vitae quam. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
  "Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.",
  "Aliquam erat volutpat. In hac habitasse platea dictumst.",
  "Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.",
  "Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.",
  "Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla.",
  "Vestibulum ac est lacinia nisi venenatis tristique.",
  "Etiam faucibus cursus urna. Ut tellus. Duis aliquam convallis nunc.",
  "Curabitur gravida nisi at nibh. In hac habitasse platea dictumst.",
  "Etiam pretium iaculis justo. Morbi a ipsum. Integer a nibh. In quis justo.",
  "Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl.",
  "In eleifend quam a odio. In hac habitasse platea dictumst. Pellentesque eget nunc.",
  "Praesent lectus. Vestibulum quam sapien, varius ut, blandit non, interdum in, ante.",
  "Etiam vel augue. Vestibulum rutrum rutrum neque. Integer non velit.",
  "Donec dapibus. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.",
  "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula.",
  "Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
  "Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna.",
  "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
];

function getRandomSentences(min, max) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const picked = [];
  for (let i = 0; i < count; i++) {
    picked.push(latinSentences[Math.floor(Math.random() * latinSentences.length)]);
  }
  return picked.join(' ');
}

function getRandomDate(startDate, endDate) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const d = new Date(start + Math.random() * (end - start));
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function generatePostSql() {
  const rows = [];
  
  // Table schema matching lab exercise
  rows.push("-- ========================================================");
  rows.push("-- Bài thực hành số 4: Tạo dữ liệu mẫu cho dự án (Mockaroo)");
  rows.push("-- Table: post (1000 records)");
  rows.push("-- Date range: 2017-07-22 to 2018-07-22");
  rows.push("-- ========================================================");
  rows.push("");
  rows.push("CREATE TABLE IF NOT EXISTS post (");
  rows.push("    id integer NOT NULL PRIMARY KEY,");
  rows.push("    author_id integer NOT NULL,");
  rows.push("    title text NOT NULL,");
  rows.push("    description text NOT NULL,");
  rows.push("    view_count integer NOT NULL,");
  rows.push("    created_at timestamp without time zone NOT NULL,");
  rows.push("    published_at timestamp without time zone NOT NULL");
  rows.push(");");
  rows.push("");

  for (let id = 1; id <= 1000; id++) {
    const author_id = Math.floor(Math.random() * 10) + 1; // random(1,10)
    let title = getRandomSentences(1, 2).replace(/'/g, "''");
    let description = getRandomSentences(1, 5).replace(/'/g, "''");
    const view_count = Math.floor(Math.random() * (500 - 100 + 1)) + 100; // min: 100, max: 500
    
    // Dates between 7/22/2017 and 7/22/2018
    const created_at = getRandomDate('2017-07-22 00:00:00', '2018-05-01 23:59:59');
    const published_at = getRandomDate(created_at, '2018-07-22 23:59:59');

    rows.push(`insert into post (id, author_id, title, description, view_count, created_at, published_at) values (${id}, ${author_id}, '${title}', '${description}', ${view_count}, '${created_at}', '${published_at}');`);
  }

  const outPath = path.join(__dirname, '..', 'database', 'post.sql');
  fs.writeFileSync(outPath, rows.join('\n'), 'utf8');
  console.log(`[Success] Generated 1000 rows in ${outPath}`);
}

generatePostSql();
