{
  description = "A Nix-flake-based Hugo development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };
  outputs = inputs@ { self, nixpkgs }:
    let
      # supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      supportedSystems = [ "x86_64-linux" ];
      forEachSupportedSystem = f: nixpkgs.lib.genAttrs supportedSystems (system: f {
        pkgs = import nixpkgs { inherit system; };
      });
    in
    {
      devShells = forEachSupportedSystem ({ pkgs }: let 
          typora = pkgs.callPackage ./.flake-package/typora.nix {};
          hugo = pkgs.callPackage ./.flake-package/hugo-extended.nix {};
        in{
          default = pkgs.mkShell {
            buildInputs = [
              pkgs.nixpkgs-fmt
            ];
            packages = [
              pkgs.shellcheck
              typora
              hugo
            ];
          };
      });
    };
}
