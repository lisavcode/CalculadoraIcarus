const Config = {
  Debug: false, // Ative para ver logs no console
  Security: {
    DisableRightClick: true,
    DisableTextSelection: true,
    DisableShortcuts: true, // Ctrl+C, Ctrl+U, F12, etc.
    BlackScreenOnPrint: true,
  },
  Messages: {
    PrintWarning: "Captura de tela não permitida!",
    DRMFailure:
      "Licença inválida ou domínio não autorizado. Entre em contato com o administrador.",
  },
  DRM: {
    Enabled: true,
    AllowedDomains: [
      "localhost",
      "127.0.0.1",
      "https://lisavcode.github.io/",
      "https://lisavcode.github.io/CalculadoraIcarus/",
    ], // Adicione seus domínios aqui
    OwnerName: "Icarus Dev", // Nome do proprietário para exibição no console
    EnableDebuggerLoop: true, // Trava o inspetor de elementos com loops de debugger
  },
};
