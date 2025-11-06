// FUNÇÃO DE MÁSCARA DE TELEFONE
 
const telefoneInput = document.querySelector('.input_telcad');
if (telefoneInput) {
  telefoneInput.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 11) valor = valor.slice(0, 11);

    if (valor.length > 6) {
      e.target.value = `(${valor.slice(0,2)}) ${valor.slice(2,7)}-${valor.slice(7)}`;
    } else if (valor.length > 2) {
      e.target.value = `(${valor.slice(0,2)}) ${valor.slice(2)}`;
    } else {
      e.target.value = valor;
    }
  });
};


// CADASTRO DE USUÁRIO 

const formCadastro = document.getElementById("formCadastro");
if (formCadastro) {
  formCadastro.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = e.target.nome.value.trim();
    const email = e.target.email.value.trim().toLowerCase();
    const senha = e.target.senha.value;
    const confirmar = e.target.confirmar_senha.value;

    if (!nome || !email || !senha) {
      alert("⚠️ Preencha todos os campos obrigatórios!");
      return;
    }

    if (senha !== confirmar) {
      alert("❌ As senhas não coincidem!");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const jaExiste = usuarios.some(u => u.email === email);
    if (jaExiste) {
      alert("❌ Este e-mail já está cadastrado! Tente fazer login.");
      return;
    }

    usuarios.push({ nome, email, senha });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("✅ Cadastro realizado com sucesso! Redirecionando para o login...");
    e.target.reset();

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  });
}
