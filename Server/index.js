const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require("dotenv").config();
const app = express();
const Assets = require("./models/assets");
const Liabilities = require("./models/liabilities");
const Incomes = require("./models/incomes");
const Transactions = require("./models/transactions");
const Expenses = require("./models/expenses");
const Histories = require("./models/history");
// const port = "3000";
const serverless = require("serverless-http");

//Middleware
app.use(express.json());
app.use(cors({
    origin: "https://financeclient.d3bewrwgtfjpy.amplifyapp.com"
  }));

  // GET request handler for /assets route
app.get('/assets', async (req, res) => {
  try {
    const allAssets = await Assets.find();
    res.status(200).json(allAssets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assets', error: error.message });
  }
});


app.put('/assets', async (req, res) => {
  const { category, assetId, assetValue } = req.body;

  try {
    const assetDocument = await Assets.findOne({ category });
    if (assetDocument) {
      const assetToUpdate = assetDocument.asset.id(assetId);
      if (assetToUpdate) {
        assetToUpdate.assetValue = assetValue;
        await assetDocument.save();
        return res.json({ success: true, message: "Asset updated successfully." });

      }
    }
    res.status(404).json({ success: false, message: "Asset not found." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error.", error: error.message });
  }
});


app.delete('/assets', async (req, res) => {
  const { category, assetId } = req.body;

  try {
    const assetDocument = await Assets.findOne({ category });
    if (assetDocument) {
      const assetToRemove = assetDocument.asset.id(assetId);
      if (assetToRemove) {
        // Remove the subdocument from the array
        assetDocument.asset.pull(assetToRemove);
        await assetDocument.save();
        return res.json({ success: true, message: "Asset updated successfully." });

      }
    }
    res.status(404).json({ success: false, message: "Asset not found." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error.", error: error.message });
  }
});

// POST request handler for /assets route
app.post('/assets', async (req, res) => {
  try {
      // Extract data from the request body
      const { category, assetTitle, assetValue } = req.body;

      // Check if an asset for the given category already exists
      let assetDocument = await Assets.findOne({ category });

      if (assetDocument) {
          // If exists, push the new asset to the asset array
          assetDocument.asset.push({ assetTitle, assetValue });
          await assetDocument.save();
      } else {
          // Otherwise, create a new document
          assetDocument = new Assets({
              category,
              asset: [{ assetTitle, assetValue }]
          });
          await assetDocument.save();
      }

      res.status(200).json({ message: 'Asset added successfully!' });

  } catch (error) {
      res.status(500).json({ message: 'Error adding asset', error: error.message });
  }
});


//Liabilities 

app.get('/liabilities', async (req, res) => {
  try {
    const allAssets = await Liabilities.find();
    res.status(200).json(allAssets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assets', error: error.message });
  }
});


app.put('/liabilities', async (req, res) => {
  const { category, liabilityId, liabilityValue } = req.body;

  try {
    const assetDocument = await Liabilities.findOne({ category });
    if (assetDocument) {
      const assetToUpdate = assetDocument.liability.id(liabilityId);
      if (assetToUpdate) {
        assetToUpdate.liabilityValue = liabilityValue;
        await assetDocument.save();
        return res.json({ success: true, message: "Asset updated successfully." });

      }
    }
    res.status(404).json({ success: false, message: "Asset not found." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error.", error: error.message });
  }
});


app.delete('/liabilities', async (req, res) => {
  const { category, liabilityId } = req.body;

  try {
    const assetDocument = await Liabilities.findOne({ category });
    if (assetDocument) {
      const assetToRemove = assetDocument.liability.id(liabilityId);
      if (assetToRemove) {
        // Remove the subdocument from the array
        assetDocument.liability.pull(assetToRemove);
        await assetDocument.save();
        return res.json({ success: true, message: "Asset updated successfully." });

      }
    }
    res.status(404).json({ success: false, message: "Asset not found." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error.", error: error.message });
  }
});


app.post('/liabilities', async (req, res) => {
  try {
      // Extract data from the request body
      const { category, liabilityTitle, liabilityValue } = req.body;

      // Check if an asset for the given category already exists
      let assetDocument = await Liabilities.findOne({ category });

      if (assetDocument) {
          // If exists, push the new asset to the asset array
          assetDocument.liability.push({ liabilityTitle, liabilityValue });
          await assetDocument.save();
      } else {
          // Otherwise, create a new document
          assetDocument = new Liabilities({
              category,
              liability: [{ liabilityTitle, liabilityValue }]
          });
          await assetDocument.save();
      }

      res.status(200).json({ message: 'Asset added successfully!' });

  } catch (error) {
      res.status(500).json({ message: 'Error adding asset', error: error.message });
  }
});

//Income

app.get('/income', async (req, res) => {
  try {
    const allIncome = await Incomes.find();
    res.status(200).json(allIncome);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assets', error: error.message });
  }
});


app.put('/income', async (req, res) => {
  const { category, incomeId, incomeValue } = req.body;

  try {
    const incomeDocument = await Incomes.findOne({ category });
    if (incomeDocument) {
      const assetToUpdate = incomeDocument.income.id(incomeId);
      if (assetToUpdate) {
        assetToUpdate.incomeValue = incomeValue;
        await incomeDocument.save();
        return res.json({ success: true, message: "Asset updated successfully." });

      }
    }
    res.status(404).json({ success: false, message: "Asset not found." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error.", error: error.message });
  }
});


app.delete('/income', async (req, res) => {
  const { category, incomeId } = req.body;

  try {
    const incomeDocument = await Incomes.findOne({ category });
    if (incomeDocument) {
      const assetToRemove = incomeDocument.income.id(incomeId);
      if (assetToRemove) {
        // Remove the subdocument from the array
        incomeDocument.income.pull(assetToRemove);
        await incomeDocument.save();
        return res.json({ success: true, message: "Asset updated successfully." });

      }
    }
    res.status(404).json({ success: false, message: "Asset not found." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error.", error: error.message });
  }
});


app.post('/income', async (req, res) => {
  try {
      // Extract data from the request body
      const { category, incomeTitle, incomeValue } = req.body;

      // Check if an asset for the given category already exists
      let incomeDocument = await Incomes.findOne({ category });

      if (incomeDocument) {
          // If exists, push the new asset to the asset array
          incomeDocument.income.push({ incomeTitle, incomeValue });
          await incomeDocument.save();
      } else {
          // Otherwise, create a new document
          incomeDocument = new Incomes({
              category,
              income: [{ incomeTitle, incomeValue }]
          });
          await incomeDocument.save();
      }

      res.status(200).json({ message: 'Asset added successfully!' });

  } catch (error) {
      res.status(500).json({ message: 'Error adding asset', error: error.message });
  }
});

app.post('/transactions', async (req, res) => {
  try {
      // If req.body.date is not provided, default to the current date-time
      req.body.date = req.body.date ? new Date(req.body.date) : new Date();

      const transaction = new Transactions(req.body);
      await transaction.save();
      res.json({ success: true, message: "Transaction saved successfully." });
  } catch (error) {
      res.status(500).json({ success: false, message: "Server Error.", error: error.message });
  }
});

//Expenses

app.get('/expenses', async (req, res) => {
  try {
    const allExpenses = await Expenses.find();
    res.status(200).json(allExpenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
});

app.put('/expenses', async (req, res) => {
  const { category, expenseId, expenseValue } = req.body;

  try {
    const expenseDocument = await Expenses.findOne({ category });
    if (expenseDocument) {
      const expenseToUpdate = expenseDocument.expenses.id(expenseId);
      if (expenseToUpdate) {
        expenseToUpdate.expensesValue = expenseValue;
        await expenseDocument.save();
        return res.json({ success: true, message: "Expense updated successfully." });
      }
    }
    res.status(404).json({ success: false, message: "Expense not found." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error.", error: error.message });
  }
});

app.delete('/expenses', async (req, res) => {
  const { category, expenseId } = req.body;

  try {
    const expenseDocument = await Expenses.findOne({ category });
    if (expenseDocument) {
      const expenseToRemove = expenseDocument.expenses.id(expenseId);
      if (expenseToRemove) {
        expenseDocument.expenses.pull(expenseToRemove);
        await expenseDocument.save();
        return res.json({ success: true, message: "Expense updated successfully." });
      }
    }
    res.status(404).json({ success: false, message: "Expense not found." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error.", error: error.message });
  }
});

app.post('/expenses', async (req, res) => {
  try {
    const { category, expenseTitle, expenseValue } = req.body;

    // Check for required fields
    if (!category || !expenseTitle || expenseValue == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let expenseDocument = await Expenses.findOne({ category });

    if (expenseDocument) {
      if (!expenseDocument.expenses) expenseDocument.expenses = [];
      expenseDocument.expenses.push({ expensesTitle: expenseTitle, expensesValue: expenseValue });
      await expenseDocument.save();
    } else {
      expenseDocument = new Expenses({
        category,
        expenses: [{ expensesTitle: expenseTitle, expensesValue: expenseValue }]
    });
      await expenseDocument.save();
    }

    res.status(200).json({ message: 'Expense added successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding s', error: error.message });
  }
});


app.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transactions.find().sort({date: -1}); // Sorting in descending order based on date-time
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error.", error: error.message });
  }
});

app.get('/history', async (req, res) => {
  try {
    const allHistories = await Histories.find();
    const income = allHistories.filter(item => item.type === 'Income');
    const expenses = allHistories.filter(item => item.type === 'Expenses');
    res.json({ income, expenses });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/history', async (req, res) => {
  try {
    const history = new Histories(req.body);
    await history.save();
    res.status(201).send(history);
  } catch (error) {
    res.status(500).send(error);
  }
});


app.delete('/history/:id', async (req, res) => {
  try {
      await Histories.findByIdAndRemove(req.params.id);
      res.status(204).send();
  } catch (error) {
    console.error("Error deleting item:", error); 
    res.status(400).json({ message: error.message }); 
}

});


  const start = async () => {
    try {
      await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
      // app.listen(port, () => {
      //   console.log(`Server is running on port ${port}`);
      // });
    } catch (e) {
      console.log(e.message);
    }
  };
  
  
  start();

  module.exports.handler = serverless(app);