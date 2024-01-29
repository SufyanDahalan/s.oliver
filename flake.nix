rec {
  description = "A Nix-flake-based Node.js development environment";

  inputs = {
    nixpkgsPinned.url = "github:NixOS/nixpkgs/nixos-23.11"; # TODO pin the dependencies!
    nixpkgsStable.url = "github:NixOS/nixpkgs/nixos-23.11";
    nixpkgsUnstable.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    fParts.url = "github:hercules-ci/flake-parts";
    process-compose-flake.url = "github:Platonic-Systems/process-compose-flake";
    devshell.url = "github:numtide/devshell";
    treefmt-nix.url = "github:numtide/treefmt-nix";

  };
  outputs = inputs @ { self, nixpkgs, fParts, ... }:
    fParts.lib.mkFlake { inherit inputs; } {

      systems = [
        "aarch64-darwin"
        "aarch64-linux"
        "x86_64-darwin"
        "x86_64-linux"
      ];
      imports = [
        inputs.devshell.flakeModule
        inputs.process-compose-flake.flakeModule
        inputs.treefmt-nix.flakeModule

      ];
      perSystem = { system, ... }:
        let
          overlays = [
            (final: prev: rec {
              nodejs = prev.nodejs-18_x;
              pnpm = prev.nodePackages.pnpm;
              yarn = (prev.yarn.override { inherit nodejs; });
            })
          ];
          pkgsStable = import inputs.nixpkgsStable { inherit overlays system; };
          pkgsUnstable = import inputs.nixpkgsUnstable { inherit overlays system; };
          lastModifiedDate = inputs.self.lastModifiedDate or inputs.self.lastModified or "19700101";
          version = builtins.substring 0 8 lastModifiedDate;
        in
        {
          #region packages
          packages = rec {
            # Utilized by `nix build .` 
            # default = { }; # TODO
          };
          #endregion

          #region apps
          apps =
            let
              buildScript =
                pkgsStable.writeShellScriptBin "script" "${pkgsStable.nix}/bin/nix build . --print-out-paths --no-link";
              buildDebugScript =
                pkgsStable.writeShellScriptBin "script" "${pkgsStable.nix}/bin/nix build . --print-out-paths --print-build-logs --no-link";
            in
            {
              build = {
                type = "app";
                program = "${buildScript}/bin/script";
              };
              buildDebug = {
                type = "app";
                program = "${buildDebugScript}/bin/script";
              };
            };

          #endregion

          #region devshells
          devshells.default = rec {
            devshell = {
              packages = with pkgsStable; [
                nodejs_21
                # TODO
              ];
              startup."add precommit hooks".text = '' 
                zsh # switch to zsh immediately
              '';
              # ${checks.pre-commit-check.shellHook} # TODO
              name = "soliver";
              motd = ''
                {202}🔨 Welcome to devshell of ${devshell.name} {reset}
                $(type -p menu &>/dev/null && menu)
              '';
              meta = { };
            };
            commands = [
              {
                name = "build";
                help = "Build the default package and print the build logs";
                command = "nix run .#build";
              }
              {
                name = "buildDebug";
                help = "Build the default package and print the build logs";
                command = "nix run .#buildDebug";
              }
              /*
                *
                See https://linuxize.com/post/how-to-run-linux-commands-in-background/ for running in background
                Better see https://stackoverflow.com/questions/1908610/how-to-get-process-id-of-background-process
                Otherwise get processes to start in the background while getting a hold on their PID. Say using `dib processes start` for starting all processes
                or `dib processes start proc1` to start a specific one.
                Then, using the PID, get their information displayed in a dashboard. Say `dib processes dashboard` or `dib processes status`. Clicking `q` in this
                dashboard is going to quit the dashboard, not stop the processes.
                Stopping the processes is going to be done using `dib processes stop` to stop all or `dib processes stop proc1`
              */
            ];
            env = [ ];
          };
          #endregion

          #region processes
          process-compose = {
            watch-server.settings.processes = {
              backend.command = "${pkgsStable.simple-http-server}/bin/simple-http-server";
              frontend.command = "${pkgsStable.cowsay}/bin/cowsay a7a";
            };
          };
          #endregion

          #region treefmt
          treefmt.config = {
            projectRootFile = "flake.nix";
            programs = {
              nixpkgs-fmt = {
                enable = true;
                package = pkgsUnstable.nixpkgs-fmt;
              };
              # prettier = { enable = true; }; # TODO
            };
          };
          #endregion

          formatter = pkgsStable.nixpkgs-fmt;
        };


      flake = {
        #region nixosConfigurations
        nixosModules = rec {
          default = soliver;
          soliver = { pkgs, lib, config, ... }:
            with lib; let
              cfg = config.services.soliver;

            in
            {
              options = {
                services.soliver = {
                  enable = mkOption {
                    type = types.bool;
                    default = false;
                    example = false;
                    description = mdDoc ''
                      Whether to enable soliver.
                    '';
                  };
                  package = mkOption {
                    type = types.package;
                    default = packages.soliver;
                    defaultText = literalExpression "pkgs.soliver";
                    description = lib.mdDoc "soliver package to use.";
                  };
                  environment-variables = mkOption {
                    type = types.attrset;
                    default = { };
                    example = {
                      apiUrl = "https://s11n.io";
                      description = "Environment variables to pass to the service.";
                    };
                  };
                };
              };
              config = mkIf cfg.enable {
                systemd = {
                  services = {
                    soliver = {
                      enable = true;
                      description = "soliver";
                      after = [ "network.target" ];
                      wantedBy = [ "multi-user.target" ];
                      environment = cfg.environment-variables; # TODO is this correct? is this going to leak anything to the store?
                      serviceConfig = {
                        Type = "simple";
                        StateDirectory = "soliver";
                        DynamicUser = true;
                        ExecStart = "${cfg.package}/bin/soliver"; # TODO make sure it works
                        Restart = "on-failure";
                        ProtectHome = true;
                        ProtectSystem = "strict";
                        PrivateTmp = true;
                        PrivateDevices = true;
                        ProtectHostname = true;
                        ProtectClock = true;
                        ProtectKernelTunables = true;
                        ProtectKernelModules = true;
                        ProtectKernelLogs = true;
                        ProtectControlGroups = true;
                        NoNewPrivileges = true;
                        RestrictRealtime = true;
                        RestrictSUIDSGID = true;
                        RemoveIPC = true;
                        PrivateMounts = true;
                        # TODO define stderr_logfile, stdout_logfile, and in general where the log files will be stores?
                        # TODO define autostart and autorestart?
                        # TODO 
                      };
                    };
                    # TODO setup postgres, in case portgres is defined in cfg.database.options
                  };
                };
              };
            };
        };
        #endregion

        #region nixosConfigurations
        nixosConfigurations = { };
        #endregion
        templates = {
          default = {
            path = ./.;
            description = "Generic flake template";
          };
        };
      };
    };
}
