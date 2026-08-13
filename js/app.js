// ======================================================
// FINANCE DASHBOARD
// ======================================================


// ======================================================
// 1. ELEMENTOS DA INTERFACE
// ======================================================


// Formulário principal.
const transactionForm =
    document.getElementById("transactionForm");


// Elementos do resumo financeiro.
const balanceElement =
    document.getElementById("balance");

const incomeElement =
    document.getElementById("income");

const expenseElement =
    document.getElementById("expense");


// Lista onde as transações serão exibidas.
const transactionList =
    document.getElementById("transactionList");


// Botão principal do formulário.
const submitButton =
    document.getElementById("submitButton");


// Botão utilizado para cancelar uma edição.
const cancelEditButton =
    document.getElementById("cancelEditButton");


// Mensagem do formulário.
const formMessage =
    document.getElementById("formMessage");


// ======================================================
// 2. ESTADO DA APLICAÇÃO
// ======================================================


// Recuperamos as transações armazenadas.
//
// JSON.parse() transforma o texto armazenado no
// localStorage novamente em um array JavaScript.
//
// Se não existir nada, começamos com um array vazio.

let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];


// ------------------------------------------------------
// Guarda o ID da transação que está sendo editada.
//
// null significa:
//
// "não estamos editando nenhuma transação".
//
// Quando o usuário clicar em Editar, essa variável
// receberá o ID correspondente.
// ------------------------------------------------------

let editingTransactionId = null;


// ======================================================
// 3. CATEGORIAS
// ======================================================


// Os valores armazenados são códigos.
//
// Exemplo:
//
// "food" → "Alimentação"
//
// Isso permite separar o valor utilizado pela aplicação
// do texto apresentado ao usuário.

const categoryLabels = {

    salary: "Salário",

    food: "Alimentação",

    transport: "Transporte",

    housing: "Moradia",

    education: "Educação",

    leisure: "Lazer",

    other: "Outros"
};


// ======================================================
// 4. FORMATAÇÃO DE MOEDA
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
// 5. SALVAR TRANSAÇÕES
// ======================================================
//
// Centralizamos a operação de persistência.
//
// Sempre que transactions for alterado, chamaremos
// esta função para atualizar o localStorage.
// ======================================================

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


// ======================================================
// 6. ADICIONAR TRANSAÇÃO
// ======================================================


function addTransaction() {

    // Capturamos os valores do formulário.
    const type =
        document.getElementById("type").value;

    const category =
        document.getElementById("category").value;

    const description =
        document
            .getElementById("description")
            .value
            .trim();

    const amount =
        Number(
            document.getElementById("amount").value
        );

    const date =
        document.getElementById("date").value;


    // Criamos o objeto da transação.
    const transaction = {

        // Date.now() gera um identificador baseado
        // no momento da criação.
        id: Date.now(),

        type: type,

        category: category,

        description: description,

        amount: amount,

        date: date
    };


    // Adicionamos ao array.
    transactions.push(transaction);


    // Salvamos no localStorage.
    saveTransactions();


    // Atualizamos a interface.
    renderTransactions();

    updateSummary();


    // Limpamos o formulário.
    transactionForm.reset();


    // Informamos o resultado.
    formMessage.textContent =
        "Transação adicionada com sucesso.";
}


// ======================================================
// 7. EDITAR TRANSAÇÃO
// ======================================================


function editTransaction(id) {

    // Procuramos a transação pelo ID.
    const transaction = transactions.find(
        function (transaction) {

            return transaction.id === id;

        }
    );


    // Se não encontrarmos a transação,
    // encerramos a função.
    if (!transaction) {
        return;
    }


    // --------------------------------------------------
    // Preenchemos o formulário com os dados existentes.
    // --------------------------------------------------

    document.getElementById("type").value =
        transaction.type;

    document.getElementById("category").value =
        transaction.category;

    document.getElementById("description").value =
        transaction.description;

    document.getElementById("amount").value =
        transaction.amount;

    document.getElementById("date").value =
        transaction.date;


    // --------------------------------------------------
    // Guardamos o ID da transação que está sendo editada.
    // --------------------------------------------------

    editingTransactionId = id;


    // --------------------------------------------------
    // Alteramos a interface para deixar claro que
    // estamos no modo de edição.
    // --------------------------------------------------

    submitButton.textContent =
        "Salvar alteração";

    cancelEditButton.hidden = false;

    formMessage.textContent =
        "Editando transação.";


    // Levamos o usuário até o formulário.
    transactionForm.scrollIntoView({
        behavior: "smooth"
    });
}


// ======================================================
// 8. SALVAR ALTERAÇÃO
// ======================================================


function updateTransaction() {

    // Procuramos o índice da transação.
    //
    // findIndex() retorna a posição do elemento
    // dentro do array.

    const transactionIndex =
        transactions.findIndex(
            function (transaction) {

                return (
                    transaction.id ===
                    editingTransactionId
                );

            }
        );


    // Se não encontramos, encerramos.
    if (transactionIndex === -1) {
        return;
    }


    // Capturamos os novos valores.

    const type =
        document.getElementById("type").value;

    const category =
        document.getElementById("category").value;

    const description =
        document
            .getElementById("description")
            .value
            .trim();

    const amount =
        Number(
            document.getElementById("amount").value
        );

    const date =
        document.getElementById("date").value;


    // --------------------------------------------------
    // Atualizamos somente a transação correspondente.
    // --------------------------------------------------

    transactions[transactionIndex] = {

        id: editingTransactionId,

        type: type,

        category: category,

        description: description,

        amount: amount,

        date: date
    };


    // Salvamos a alteração.
    saveTransactions();


    // Atualizamos a interface.
    renderTransactions();

    updateSummary();


    // Voltamos para o modo normal.
    resetEditMode();


    formMessage.textContent =
        "Transação atualizada com sucesso.";
}


// ======================================================
// 9. EXCLUIR TRANSAÇÃO
// ======================================================


function deleteTransaction(id) {

    // Localizamos a transação antes de excluir.
    const transaction = transactions.find(
        function (transaction) {

            return transaction.id === id;

        }
    );


    if (!transaction) {
        return;
    }


    // --------------------------------------------------
    // Pedimos confirmação antes de excluir.
    //
    // confirm() retorna:
    //
    // true  → usuário confirmou
    // false → usuário cancelou
    // --------------------------------------------------

    const confirmed = confirm(
        `Deseja excluir "${transaction.description}"?`
    );


    // Se o usuário cancelou, não fazemos nada.
    if (!confirmed) {
        return;
    }


    // --------------------------------------------------
    // filter() cria um novo array contendo todos os
    // elementos, EXCETO aquele que possui o ID informado.
    // --------------------------------------------------

    transactions = transactions.filter(
        function (transaction) {

            return transaction.id !== id;

        }
    );


    // Salvamos o novo array.
    saveTransactions();


    // Atualizamos a interface.
    renderTransactions();

    updateSummary();


    // Se a transação excluída estava sendo editada,
    // cancelamos o modo de edição.
    if (editingTransactionId === id) {

        resetEditMode();

    }


    formMessage.textContent =
        "Transação excluída com sucesso.";
}


// ======================================================
// 10. CANCELAR EDIÇÃO
// ======================================================


function resetEditMode() {

    // Voltamos ao estado inicial.
    editingTransactionId = null;


    // Restauramos o texto do botão.
    submitButton.textContent =
        "Adicionar transação";


    // Escondemos o botão cancelar.
    cancelEditButton.hidden = true;


    // Limpamos os campos.
    transactionForm.reset();
}


// ======================================================
// 11. RENDERIZAR TRANSAÇÕES
// ======================================================


function renderTransactions() {

    // Limpamos a lista antes de renderizar novamente.
    transactionList.innerHTML = "";


    // Se não houver transações...
    if (transactions.length === 0) {

        transactionList.innerHTML = `
            <p class="empty-message">
                Nenhuma transação cadastrada.
            </p>
        `;

        return;
    }


    // Percorremos todas as transações.
    transactions.forEach(
        function (transaction) {

            // Classe visual baseada no tipo.
            const typeClass =
                transaction.type === "income"
                    ? "transaction-income"
                    : "transaction-expense";


            // Sinal visual.
            const signal =
                transaction.type === "income"
                    ? "+"
                    : "-";


            // Criamos um elemento HTML.
            const transactionElement =
                document.createElement("div");


            transactionElement.classList.add(
                "transaction"
            );


            // --------------------------------------------------
            // data-id
            // --------------------------------------------------
            //
            // Armazenamos o ID da transação no elemento HTML.
            //
            // Depois podemos descobrir qual transação foi
            // clicada.
            // --------------------------------------------------

            transactionElement.dataset.id =
                transaction.id;


            // Inserimos o conteúdo.
            transactionElement.innerHTML = `

                <div class="transaction-info">

                    <strong>
                        ${transaction.description}
                    </strong>

                    <span>
                        ${
                            categoryLabels[
                                transaction.category
                            ]
                        }
                        -
                        ${transaction.date}
                    </span>

                </div>


                <strong class="${typeClass}">
                    ${signal}
                    ${formatCurrency(
                        transaction.amount
                    )}
                </strong>


                <div class="transaction-actions">

                    <button
                        type="button"
                        class="edit-button"
                        data-action="edit"
                    >
                        Editar
                    </button>


                    <button
                        type="button"
                        class="delete-button"
                        data-action="delete"
                    >
                        Excluir
                    </button>

                </div>

            `;


            // Adicionamos a transação na página.
            transactionList.appendChild(
                transactionElement
            );

        }
    );
}


// ======================================================
// 12. ATUALIZAR RESUMO
// ======================================================


function updateSummary() {

    // --------------------------------------------------
    // Total de receitas.
    // --------------------------------------------------

    const totalIncome =
        transactions
            .filter(
                function (transaction) {

                    return (
                        transaction.type ===
                        "income"
                    );

                }
            )
            .reduce(
                function (total, transaction) {

                    return (
                        total +
                        transaction.amount
                    );

                },
                0
            );


    // --------------------------------------------------
    // Total de despesas.
    // --------------------------------------------------

    const totalExpense =
        transactions
            .filter(
                function (transaction) {

                    return (
                        transaction.type ===
                        "expense"
                    );

                }
            )
            .reduce(
                function (total, transaction) {

                    return (
                        total +
                        transaction.amount
                    );

                },
                0
            );


    // Saldo = receitas - despesas.
    const balance =
        totalIncome - totalExpense;


    // Atualizamos a interface.
    incomeElement.textContent =
        formatCurrency(totalIncome);

    expenseElement.textContent =
        formatCurrency(totalExpense);

    balanceElement.textContent =
        formatCurrency(balance);
}


// ======================================================
// 13. EVENTO DO FORMULÁRIO
// ======================================================


transactionForm.addEventListener(
    "submit",
    function (event) {

        // Impede o recarregamento da página.
        event.preventDefault();


        // --------------------------------------------------
        // Validação básica.
        // --------------------------------------------------

        const type =
            document.getElementById("type").value;

        const category =
            document.getElementById("category").value;

        const description =
            document
                .getElementById("description")
                .value
                .trim();

        const amount =
            Number(
                document.getElementById("amount").value
            );

        const date =
            document.getElementById("date").value;


        // Verificamos se todos os campos foram preenchidos.
        if (
            !type ||
            !category ||
            !description ||
            !amount ||
            !date
        ) {

            formMessage.textContent =
                "Preencha todos os campos.";

            return;
        }


        // Valor precisa ser maior que zero.
        if (amount <= 0) {

            formMessage.textContent =
                "O valor deve ser maior que zero.";

            return;
        }


        // --------------------------------------------------
        // Decidimos se vamos criar ou editar.
        // --------------------------------------------------

        if (editingTransactionId === null) {

            // Nenhuma transação está sendo editada.
            // Portanto, criamos uma nova.

            addTransaction();

        } else {

            // Existe uma transação em edição.
            // Portanto, atualizamos essa transação.

            updateTransaction();

        }

    }
);


// ======================================================
// 14. CANCELAR EDIÇÃO
// ======================================================


cancelEditButton.addEventListener(
    "click",
    function () {

        resetEditMode();

        formMessage.textContent =
            "Edição cancelada.";

    }
);


// ======================================================
// 15. EVENTOS DOS BOTÕES DE TRANSAÇÃO
// ======================================================
//
// Como os botões Editar e Excluir são criados
// dinamicamente pelo renderTransactions(),
// não podemos simplesmente selecioná-los uma única vez.
//
// Utilizamos delegação de eventos:
// escutamos o clique na lista e identificamos
// qual botão foi pressionado.
// ======================================================

transactionList.addEventListener(
    "click",
    function (event) {

        // Procuramos o botão que recebeu o clique.
        const button =
            event.target.closest("button");


        // Se o clique não aconteceu em um botão,
        // não fazemos nada.
        if (!button) {
            return;
        }


        // Encontramos a transação correspondente.
        const transactionElement =
            button.closest(".transaction");


        // Recuperamos o ID armazenado no data-id.
        const id =
            Number(
                transactionElement.dataset.id
            );


        // Descobrimos qual ação foi solicitada.
        const action =
            button.dataset.action;


        // Executamos a ação correspondente.

        if (action === "edit") {

            editTransaction(id);

        }


        if (action === "delete") {

            deleteTransaction(id);

        }

    }
);


// ======================================================
// 16. INICIALIZAÇÃO
// ======================================================
//
// Quando a página abre, carregamos os dados existentes.
// ======================================================

renderTransactions();

updateSummary();