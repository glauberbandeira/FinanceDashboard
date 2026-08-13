// ======================================================
// FINANCE DASHBOARD
// ======================================================


// ------------------------------------------------------
// 1. Selecionamos o formulário.
//
// Será utilizado para capturar novas transações.
// ------------------------------------------------------

const transactionForm =
    document.getElementById("transactionForm");


// ------------------------------------------------------
// 2. Selecionamos os elementos do resumo financeiro.
// ------------------------------------------------------

const balanceElement =
    document.getElementById("balance");

const incomeElement =
    document.getElementById("income");

const expenseElement =
    document.getElementById("expense");


// ------------------------------------------------------
// 3. Selecionamos a área onde as transações serão
//    exibidas.
// ------------------------------------------------------

const transactionList =
    document.getElementById("transactionList");


// ------------------------------------------------------
// 4. Recuperamos as transações armazenadas.
//
// localStorage retorna uma string.
//
// JSON.parse() converte essa string para um array.
//
// Se não existir nenhuma transação, utilizamos []
// como valor inicial.
// ------------------------------------------------------

let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];


// ------------------------------------------------------
// 5. Evento de envio do formulário.
// ------------------------------------------------------

transactionForm.addEventListener(
    "submit",
    function (event) {

        // Impede o recarregamento da página.
        event.preventDefault();


        // --------------------------------------------------
        // Capturamos os valores digitados.
        // --------------------------------------------------

        const type =
            document.getElementById("type").value;

        const category =
            document.getElementById("category").value;

        const description =
            document.getElementById("description")
                .value
                .trim();

        const amount =
            Number(
                document.getElementById("amount").value
            );

        const date =
            document.getElementById("date").value;


        // --------------------------------------------------
        // Criamos o objeto da transação.
        // --------------------------------------------------

        const transaction = {

            // ID único para identificar a transação.
            id: Date.now(),

            type: type,

            category: category,

            description: description,

            amount: amount,

            date: date
        };


        // --------------------------------------------------
        // Adicionamos a nova transação ao array.
        // --------------------------------------------------

        transactions.push(transaction);


        // --------------------------------------------------
        // Salvamos o array atualizado no localStorage.
        // --------------------------------------------------

        localStorage.setItem(
            "transactions",
            JSON.stringify(transactions)
        );


        // --------------------------------------------------
        // Atualizamos a interface.
        // --------------------------------------------------

        renderTransactions();

        updateSummary();


        // --------------------------------------------------
        // Limpamos o formulário.
        // --------------------------------------------------

        transactionForm.reset();

    }
);


// ======================================================
// FUNÇÃO: formatCurrency
// ======================================================
//
// Converte um número para o formato de moeda brasileira.
//
// Exemplo:
//
// 1500
// ↓
// R$ 1.500,00
//
// ======================================================

function formatCurrency(value) {

    return value.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


// ======================================================
// FUNÇÃO: renderTransactions
// ======================================================
//
// Responsável por mostrar as transações na tela.
// ======================================================

function renderTransactions() {

    // Limpamos a lista antes de reconstruí-la.
    transactionList.innerHTML = "";


    // --------------------------------------------------
    // Se não houver transações, mostramos uma mensagem.
    // --------------------------------------------------

    if (transactions.length === 0) {

        transactionList.innerHTML = `
            <p class="empty-message">
                Nenhuma transação cadastrada.
            </p>
        `;

        return;
    }


    // --------------------------------------------------
    // Percorremos todas as transações.
    // --------------------------------------------------

    transactions.forEach(function (transaction) {

        // Definimos a classe de acordo com o tipo.
        const typeClass =
            transaction.type === "income"
                ? "transaction-income"
                : "transaction-expense";


        // Definimos o sinal que aparecerá no valor.
        const signal =
            transaction.type === "income"
                ? "+"
                : "-";


        // Criamos o elemento visual da transação.
        const transactionElement =
            document.createElement("div");

        transactionElement.classList.add(
            "transaction"
        );


        // Inserimos o conteúdo da transação.
        transactionElement.innerHTML = `

            <div class="transaction-info">

                <strong>
                    ${transaction.description}
                </strong>

                <span>
                    ${transaction.category}
                    -
                    ${transaction.date}
                </span>

            </div>

            <strong class="${typeClass}">
                ${signal}
                ${formatCurrency(transaction.amount)}
            </strong>

        `;


        // Adicionamos a transação à lista.
        transactionList.appendChild(
            transactionElement
        );

    });
}


// ======================================================
// FUNÇÃO: updateSummary
// ======================================================
//
// Calcula:
//
// - total de receitas
// - total de despesas
// - saldo
//
// ======================================================

function updateSummary() {

    // --------------------------------------------------
    // Calculamos todas as receitas.
    // --------------------------------------------------

    const totalIncome =
        transactions
            .filter(function (transaction) {

                return transaction.type === "income";

            })
            .reduce(function (total, transaction) {

                return total + transaction.amount;

            }, 0);


    // --------------------------------------------------
    // Calculamos todas as despesas.
    // --------------------------------------------------

    const totalExpense =
        transactions
            .filter(function (transaction) {

                return transaction.type === "expense";

            })
            .reduce(function (total, transaction) {

                return total + transaction.amount;

            }, 0);


    // --------------------------------------------------
    // O saldo é:
    //
    // receitas - despesas
    // --------------------------------------------------

    const balance =
        totalIncome - totalExpense;


    // --------------------------------------------------
    // Atualizamos os valores na interface.
    // --------------------------------------------------

    incomeElement.textContent =
        formatCurrency(totalIncome);

    expenseElement.textContent =
        formatCurrency(totalExpense);

    balanceElement.textContent =
        formatCurrency(balance);
}


// ======================================================
// INICIALIZAÇÃO
// ======================================================
//
// Quando a página é aberta, precisamos carregar
// os dados que já estavam armazenados.
// ======================================================

renderTransactions();

updateSummary();