{
  description = "Ephemeral Nix Environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, ... }:
    let
      system = if builtins.currentSystem == "x86_64-darwin" then "x86_64-darwin"
                else if builtins.currentSystem == "aarch64-darwin" then "aarch64-darwin"
                else "x86_64-linux";
    in
    {
      devShells."${system}".default =
        let
          pkgs = import nixpkgs {
            inherit system;
          };
        in
        pkgs.mkShell {
          # create an environment with nodejs_20, and pnpm
          packages = with pkgs; [
            nodejs_20
            nodePackages.pnpm
            nushell # BECAUSE I WANT NUSHELL
          ];

          shellHook = ''
            echo "node `${pkgs.nodejs}/bin/node --version`"
            exec nu
          '';
        };
    };
}