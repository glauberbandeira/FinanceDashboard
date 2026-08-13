// ======================================================
// FINANCE DASHBOARD
// ======================================================


// ======================================================
// 1. ELEMENTOS DA INTERFACE
// ======================================================


// Formulário de transação.
const transactionForm =
    document.getElementById("transactionForm");


// Resumo financeiro.
const balanceElement =
    document.getElementById("balance");

const incomeElement =
    document.getElementById("income");

const expenseElement =
    document.getElementById("expense");


// Lista de transações.
const transactionList =
    document.getElementById("transactionList");


// Botão principal do formulário.
const submitButton =
    document.getElementById("submitButton");


// Botão para cancelar edição.
const cancelEditButton =
    document.getElementById("cancelEditButton");


// Mensagem do formulário.
const formMessage =
    document.getElementById("formMessage");


// ======================================================
// 2. ELEMENTOS DOS FILTROS
// ======================================================


// Filtro por tipo.
const filterType =
    document.getElementById("filterType");


// Filtro por categoria.
const filterCategory =
    document.getElementById("filterCategory");


// Campo de pesquisa.
const searchInput =
    document.getElementById("searchInput");


// Botão que executa a pesquisa.
const applyFiltersButton =
    document.getElementById("applyFiltersButton");


// ======================================================
// 3. VALIDAÇÃO DOS ELEMENTOS
// ======================================================
//
// Esta verificação facilita muito encontrar erros
// de HTML/JavaScript.
//
// Se algum elemento estiver faltando, o navegador
// mostrará uma mensagem clara no console.
// ======================================================

if (!filterType) {
    console.error("Elemento #filterType não encontrado.");
}

if (!filterCategory) {
    console.error("Elemento #filterCategory não encontrado.");
}

if (!searchInput) {
    console.error("Elemento #searchInput não encontrado.");
}

if (!applyFiltersButton) {
    console.error(
        "Elemento #applyFiltersButton não encontrado."
    );
}


// ======================================================
// 4. ESTADO DA APLICAÇÃO
// ======================================================


// Recuperamos as transações existentes.
//
// O localStorage armazena os dados como string.
// JSON.parse() transforma novamente em array.
//
// Caso não exista nenhuma transação, usamos [].

let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];


// ------------------------------------------------------
// Guarda o ID da transação que está sendo editada.
//
// null = nenhuma edição.
// ------------------------------------------------------

let editingTransactionId = null;


// ------------------------------------------------------
// Guarda os filtros atualmente aplicados.
//
// Isso é diferente dos valores digitados.
//
// O usuário pode preencher os filtros e somente quando
// clicar em "Aplicar filtros" eles passam para este objeto.
// ------------------------------------------------------

let activeFilters = {

    type: "all",

    category: "all",

    search: ""

};


// ======================================================
// 5. CATEGORIAS
// ======================================================


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
// 6. FORMATAÇÃO DE MOEDA
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
// 7. SALVAR TRANSAÇÕES
// ======================================================


function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


// ======================================================
// 8. ADICIONAR TRANSAÇÃO
// ======================================================


function addTransaction() {

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


    // Criamos a nova transação.
    const transaction = {

        id: Date.now(),

        type: type,

        category: category,

        description: description,

        amount: amount,

        date: date

    };


    // Adicionamos ao array.
    transactions.push(transaction);


    // Persistimos os dados.
    saveTransactions();


    // Atualizamos a tela.
    renderTransactions();

    updateSummary();


    // Limpamos o formulário.
    transactionForm.reset();


    formMessage.textContent =
        "Transação adicionada com sucesso.";
}


// ======================================================
// 9. EDITAR TRANSAÇÃO
// ======================================================


function editTransaction(id) {

    // Procuramos a transação pelo ID.
    const transaction =
        transactions.find(
            function (transaction) {

                return transaction.id === id;

            }
        );


    // Caso não exista, encerramos.
    if (!transaction) {
        return;
    }


    // Colocamos os dados no formulário.

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


    // Guardamos o ID que está sendo editado.
    editingTransactionId = id;


    // Alteramos a interface.
    submitButton.textContent =
        "Salvar alteração";

    cancelEditButton.hidden = false;

    formMessage.textContent =
        "Editando transação.";


    // Levamos o usuário ao formulário.
    transactionForm.scrollIntoView({
        behavior: "smooth"
    });
}


// ======================================================
// 10. ATUALIZAR TRANSAÇÃO
// ======================================================


function updateTransaction() {

    // Procuramos a posição da transação no array.
    const transactionIndex =
        transactions.findIndex(
            function (transaction) {

                return (
                    transaction.id ===
                    editingTransactionId
                );

            }
        );


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


    // Substituímos a transação antiga.
    transactions[transactionIndex] = {

        id: editingTransactionId,

        type: type,

        category: category,

        description: description,

        amount: amount,

        date: date

    };


    // Salvamos novamente.
    saveTransactions();


    // Atualizamos a interface.
    renderTransactions();

    updateSummary();


    // Voltamos ao modo normal.
    resetEditMode();


    formMessage.textContent =
        "Transação atualizada com sucesso.";
}


// ======================================================
// 11. EXCLUIR TRANSAÇÃO
// ======================================================


function deleteTransaction(id) {

    const transaction =
        transactions.find(
            function (transaction) {

                return transaction.id === id;

            }
        );


    if (!transaction) {
        return;
    }


    // Confirmação antes da exclusão.
    const confirmed = confirm(
        `Deseja excluir "${transaction.description}"?`
    );


    if (!confirmed) {
        return;
    }


    // Mantemos todas as transações EXCETO a selecionada.
    transactions =
        transactions.filter(
            function (transaction) {

                return transaction.id !== id;

            }
        );


    // Persistimos a alteração.
    saveTransactions();


    // Atualizamos a tela.
    renderTransactions();

    updateSummary();


    // Caso a transação excluída estivesse sendo editada.
    if (editingTransactionId === id) {

        resetEditMode();

    }


    formMessage.textContent =
        "Transação excluída com sucesso.";
}


// ======================================================
// 12. CANCELAR EDIÇÃO
// ======================================================


function resetEditMode() {

    editingTransactionId = null;

    submitButton.textContent =
        "Adicionar transação";

    cancelEditButton.hidden = true;

    transactionForm.reset();
}


// ======================================================
// 13. OBTER TRANSAÇÕES FILTRADAS
// ======================================================


function getFilteredTransactions() {

    // Criamos uma cópia do array original.
    let filteredTransactions =
        [...transactions];


    // --------------------------------------------------
    // FILTRO POR TIPO
    // --------------------------------------------------

    if (activeFilters.type !== "all") {

        filteredTransactions =
            filteredTransactions.filter(
                function (transaction) {

                    return (
                        transaction.type ===
                        activeFilters.type
                    );

                }
            );
    }


    // --------------------------------------------------
    // FILTRO POR CATEGORIA
    // --------------------------------------------------

    if (activeFilters.category !== "all") {

        filteredTransactions =
            filteredTransactions.filter(
                function (transaction) {

                    return (
                        transaction.category ===
                        activeFilters.category
                    );

                }
            );
    }


    // --------------------------------------------------
    // PESQUISA POR DESCRIÇÃO
    // --------------------------------------------------

    if (activeFilters.search) {

        filteredTransactions =
            filteredTransactions.filter(
                function (transaction) {

                    return transaction.description
                        .toLowerCase()
                        .includes(
                            activeFilters.search
                        );

                }
            );
    }


    return filteredTransactions;
}


// ======================================================
// 14. RENDERIZAR TRANSAÇÕES
// ======================================================


function renderTransactions() {

    // Limpamos a lista.
    transactionList.innerHTML = "";


    // Pegamos os dados filtrados.
    const filteredTransactions =
        getFilteredTransactions();


    // Nenhuma transação cadastrada.
    if (transactions.length === 0) {

        transactionList.innerHTML = `
            <p class="empty-message">
                Nenhuma transação cadastrada.
            </p>
        `;

        return;
    }


    // Existem transações, mas nenhuma corresponde
    // aos filtros.
    if (filteredTransactions.length === 0) {

        transactionList.innerHTML = `
            <p class="empty-message">
                Nenhuma transação encontrada.
            </p>
        `;

        return;
    }


    // Renderizamos as transações.
    filteredTransactions.forEach(
        function (transaction) {

            const typeClass =
                transaction.type === "income"
                    ? "transaction-income"
                    : "transaction-expense";


            const signal =
                transaction.type === "income"
                    ? "+"
                    : "-";


            const transactionElement =
                document.createElement("div");


            transactionElement.classList.add(
                "transaction"
            );


            // Guardamos o ID no HTML.
            transactionElement.dataset.id =
                transaction.id;


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


            transactionList.appendChild(
                transactionElement
            );

        }
    );
}


// ======================================================
// 15. ATUALIZAR RESUMO
// ======================================================


function updateSummary() {

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


    const balance =
        totalIncome - totalExpense;


    incomeElement.textContent =
        formatCurrency(totalIncome);

    expenseElement.textContent =
        formatCurrency(totalExpense);

    balanceElement.textContent =
        formatCurrency(balance);
}


// ======================================================
// 16. FORMULÁRIO DE TRANSAÇÃO
// ======================================================


transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


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


        // Validação dos campos.
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


        // O valor precisa ser positivo.
        if (amount <= 0) {

            formMessage.textContent =
                "O valor deve ser maior que zero.";

            return;
        }


        // Decide entre criar e editar.
        if (editingTransactionId === null) {

            addTransaction();

        } else {

            updateTransaction();

        }

    }
);


// ======================================================
// 17. CANCELAR EDIÇÃO
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
// 18. EDITAR / EXCLUIR
// ======================================================
//
// Usamos delegação de eventos porque os botões são
// criados dinamicamente pelo renderTransactions().
// ======================================================

transactionList.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest("button");


        if (!button) {
            return;
        }


        const transactionElement =
            button.closest(".transaction");


        if (!transactionElement) {
            return;
        }


        const id =
            Number(
                transactionElement.dataset.id
            );


        const action =
            button.dataset.action;


        if (action === "edit") {

            editTransaction(id);

        }


        if (action === "delete") {

            deleteTransaction(id);

        }

    }
);


// ======================================================
// 19. APLICAR FILTROS
// ======================================================
//
// Agora os filtros somente são executados quando
// o usuário clicar no botão.
// ======================================================

applyFiltersButton.addEventListener(
    "click",
    function () {

        // Pegamos os valores selecionados.
        activeFilters.type =
            filterType.value;

        activeFilters.category =
            filterCategory.value;

        activeFilters.search =
            searchInput.value
                .trim()
                .toLowerCase();


        // Aplicamos os filtros.
        renderTransactions();

    }
);


// ======================================================
// 20. INICIALIZAÇÃO
// ======================================================
//
// Esta parte precisa ser executada quando a página
// é carregada.
//
// Ela recupera as transações do localStorage e
// mostra os dados imediatamente.
// ======================================================

renderTransactions();

updateSummary();