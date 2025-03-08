
$(document).ready(function () {
    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        var cpf_cli_format = $(this).find("#CPF").val();
        cpf_cli_format = cpf_cli_format.replace(/[^\d]/g, '');
        

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": cpf_cli_format,
                "Beneficiarios": $("tr.beneficiario").map(function () {
                    var cpf_bnf_format = $(this).find("td.cpf_bnf").text().trim();
                    return {
                        "CPF_bnf": cpf_bnf_format.replace(/[^\d]/g, ''),
                        "Nome_bnf": $(this).find("td.nome_bnf").text().trim()
                    };
                }).get()
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();
                $("#tabelaBeneficiarios").empty();
            }
        });
    })
    
})

function isCPFExist(cpf) {
    let cpfExistente = false;
    $("tr.beneficiario").each(function () {
        let cpfAtual = $(this).find("td.cpf_bnf").text().trim(); 
        if (cpfAtual === cpf) {
            cpfExistente = true; 
            return false;
        }
    });
    return cpfExistente;
}

$(document).on("click", ".editarBeneficiario", function () {
    linhaEditando = $(this).closest("tr"); // Guarda a linha que está sendo editada

    // Preenche os campos do formulário com os valores da linha
    $("#CPF_bnf").val(linhaEditando.find(".cpf_bnf").text());
    $("#nome_bnf").val(linhaEditando.find(".nome_bnf").text());


    $(this).closest("tr").remove();
});

$(document).on("click", ".btnExcluir", function () {
    $(this).closest("tr").remove();
    if ($(this).closest("tr").length) {
        // Está dentro de uma <tr>
        console.log("Estamos dentro de uma <tr>" + $(this).closest("tr").attr("id"));
    } else {
        // Não está dentro de uma <tr>
        console.log("Não estamos dentro de uma <tr>");
    }
});


function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

