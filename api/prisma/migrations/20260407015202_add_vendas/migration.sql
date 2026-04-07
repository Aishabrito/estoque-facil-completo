-- CreateTable
CREATE TABLE "configuracoes" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "margemLucro" DECIMAL(5,2) NOT NULL DEFAULT 30,
    "impostos" DECIMAL(5,2) NOT NULL DEFAULT 15,
    "custoOperacional" DECIMAL(5,2) NOT NULL DEFAULT 10,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendas" (
    "id" SERIAL NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "formaPagamento" TEXT NOT NULL DEFAULT 'dinheiro',
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "vendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_venda" (
    "id" SERIAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoNoMomento" DECIMAL(10,2) NOT NULL,
    "vendaId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,

    CONSTRAINT "itens_venda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_venda" ADD CONSTRAINT "itens_venda_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "vendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_venda" ADD CONSTRAINT "itens_venda_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
