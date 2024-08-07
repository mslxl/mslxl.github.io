{
  description = "A Nix-flake-based Hugo development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };
  outputs = inputs@ { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forEachSupportedSystem = f: nixpkgs.lib.genAttrs supportedSystems (system: f rec {
        pkgs = import nixpkgs { inherit system; };
      });
    in
    {
      devShells = forEachSupportedSystem ({ pkgs }: 
        {
          default = pkgs.mkShell {
            buildInputs = [
              pkgs.nixpkgs-fmt
            ];
            packages = (with pkgs; [
              typst-lsp

              pkgs.shellcheck
              pandoc
              nodejs
              nodejs.pkgs.pnpm

              just
            ]);
            shellHook = ''
              pnpm install
            '';
          };
      });
    };
}
