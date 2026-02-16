(function () {
  if (typeof Config === "undefined") {
    console.error("Config.js não foi carregado corretamente.");
    return;
  }

  const debug = Config.Debug;

  function log(message) {
    if (debug) console.log(`[Security] ${message}`);
  }

  // Desabilitar Menu de Contexto (Botão Direito)
  if (Config.Security.DisableRightClick) {
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      log("Menu de contexto bloqueado.");
    });
  }

  // Desabilitar Seleção de Texto e Arrastar
  if (Config.Security.DisableTextSelection) {
    document.addEventListener("selectstart", function (e) {
      e.preventDefault();
      log("Seleção de texto bloqueada.");
    });

    document.addEventListener("dragstart", function (e) {
      e.preventDefault();
      log("Arrastar bloqueado.");
    });

    // Adiciona estilo CSS para desabilitar seleção
    const style = document.createElement("style");
    style.innerHTML = `
            body {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
        `;
    document.head.appendChild(style);
  }

  // Desabilitar Atalhos de Teclado
  if (Config.Security.DisableShortcuts) {
    document.addEventListener("keydown", function (e) {
      // Bloqueia F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey &&
          e.shiftKey &&
          (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "u"))
      ) {
        e.preventDefault();
        log("Ferramentas de desenvolvedor bloqueadas.");
        return false;
      }

      // Bloqueia Ctrl+C, Ctrl+A, Ctrl+X, Ctrl+S, Ctrl+P
      if (
        e.ctrlKey &&
        ["c", "a", "x", "s", "p"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        log(`Atalho Ctrl+${e.key.toUpperCase()} bloqueado.`);
        return false;
      }
    });
  }

  // Detecção de PrintScreen e Ofurcação de Tela
  if (Config.Security.BlackScreenOnPrint) {
    const overlay = document.createElement("div");
    overlay.id = "security-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "black";
    overlay.style.zIndex = "999999";
    overlay.style.display = "none";
    overlay.style.pointerEvents = "none"; // Permite clicar através se necessário, mas aqui queremos bloquear visão
    document.body.appendChild(overlay);

    function blacoutScreen() {
      log("PrintScreen detectado! Tela ofuscada.");
      overlay.style.display = "block";

      // Tenta limpar a área de transferência
      if (navigator.clipboard) {
        navigator.clipboard.writeText("");
      }

      setTimeout(() => {
        overlay.style.display = "none";
      }, 1000); // Tela preta por 1 segundo (ajuste conforme necessário)
    }

    // Detecta a tecla PrintScreen (keyup é mais confiável para PrintScreen em alguns navegadores)
    document.addEventListener("keyup", function (e) {
      if (e.key === "PrintScreen") {
        blacoutScreen();
      }
    });

    // Backup visual caso o usuário use atalhos de SO que não disparam key events no browser (difícil bloquear 100% via web)
    // Monitora o foco da janela para tentar ofuscar se perder o foco (opcional, pode ser irritante)
    /*
        window.addEventListener('blur', function() {
             // Pode ser muito agressivo
        });
        */
  }

  // --- SISTEMA DRM ---
  if (Config.DRM && Config.DRM.Enabled) {
    log("Verificando DRM...");

    const currentDomain = window.location.hostname;
    const allowedDomains = Config.DRM.AllowedDomains;
    const isAllowed = allowedDomains.some(
      (domain) =>
        currentDomain === domain || currentDomain.endsWith("." + domain),
    );

    if (!isAllowed && currentDomain !== "") {
      // currentDomain vazio geralmente é arquivo local (file://), pode ou não bloquear
      log(`Violação de DRM: Domínio '${currentDomain}' não autorizado.`);
      document.body.innerHTML = "";
      document.body.style.backgroundColor = "black";
      document.body.style.color = "red";
      document.body.style.display = "flex";
      document.body.style.justifyContent = "center";
      document.body.style.alignItems = "center";
      document.body.style.height = "100vh";
      document.body.style.fontSize = "24px";
      document.body.innerText = Config.Messages.DRMFailure;

      // Trava a execução
      throw new Error("DRM Violation");
    }

    if (Config.DRM.EnableDebuggerLoop) {
      // Loop simples de debugger para dificultar a inspeção
      setInterval(function () {
        debugger;
      }, 1000);
    }

    console.log(
      `%c Protegido por: ${Config.DRM.OwnerName}`,
      "color: #00eeff; font-weight: bold; font-size: 14px;",
    );
  }

  log("Sistema de segurança inicializado.");
})();
