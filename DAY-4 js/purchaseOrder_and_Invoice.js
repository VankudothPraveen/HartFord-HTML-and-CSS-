const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ---------- Utility Functions ----------

function generateNumber() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let res = "";
  for (let i = 0; i < 3; i++) {
    res += letters[Math.floor(Math.random() * letters.length)];
  }
  for (let i = 0; i < 3; i++) {
    res += Math.floor(Math.random() * 10);
  }
  return res;
}

function calculateAmount(rate, duration) {
  return rate * duration;
}

function addDays(date, days) {
  let d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// ---------- Purchase Order ----------

function createPO(trainer, training, payment) {
  let totalAmount = calculateAmount(payment.rate, payment.duration);

  return {
    poNumber: generateNumber(),
    trainer,
    training,
    payment,
    totalAmount
  };
}

// ---------- Invoice ----------

function generateInvoice(po) {
  let today = new Date();
  let endDate = new Date(po.training.endDate);

  if (today < endDate) {
    console.log("\n❌ Training not completed. Invoice cannot be generated.");
    return null;
  }

  return {
    invoiceNumber: generateNumber(),
    poNumber: po.poNumber,
    trainerName: po.trainer.name,
    courseName: po.training.courseName,
    totalAmount: po.totalAmount,
    invoiceDate: today,
    dueDate: addDays(today, 30),
    status: "UNPAID"
  };
}

// ---------- Overdue Check ----------

function checkOverdue(invoice) {
  let today = new Date();
  if (invoice.status === "UNPAID" && today > invoice.dueDate) {
    invoice.status = "OVERDUE";
    console.log("\n⚠️ Invoice is OVERDUE");
    console.log("📧 Email sent to accounts team");
  }
}

// ---------- INPUT FLOW ----------

let trainer = {};
let training = {};
let payment = {};

rl.question("Trainer Name: ", (name) => {
  trainer.name = name;

  rl.question("Trainer Email: ", (email) => {
    trainer.email = email;

    rl.question("Trainer Experience: ", (exp) => {
      trainer.experience = exp;

      rl.question("Course Name: ", (course) => {
        training.courseName = course;

        rl.question("Client Name: ", (client) => {
          training.clientName = client;

          rl.question("Training Start Date (YYYY-MM-DD): ", (start) => {
            training.startDate = start;

            rl.question("Training End Date (YYYY-MM-DD): ", (end) => {
              training.endDate = end;

              rl.question("Payment Type (Hourly/Daily/Monthly): ", (type) => {
                payment.type = type;

                rl.question("Rate per unit: ", (rate) => {
                  payment.rate = Number(rate);

                  rl.question("Duration (Hours/Days/Months): ", (duration) => {
                    payment.duration = Number(duration);

                    // ---------- PROCESS ----------
                    let po = createPO(trainer, training, payment);

                    console.log("\n✅ PURCHASE ORDER");
                    console.log(po);

                    let invoice = generateInvoice(po);

                    if (invoice) {
                      console.log("\n📄 INVOICE");
                      console.log(invoice);
                      checkOverdue(invoice);
                    }

                    rl.close();
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
