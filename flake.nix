{
  description = "astro env";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };
  outputs = { self, nixpkgs }:
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
            nativeBuildInputs = with pkgs; [
              playwright-driver.browsers
            ];
            packages = (with pkgs; [
              typst-lsp

              pkgs.shellcheck
             
              nodejs
              nodejs.pkgs.pnpm

              just
            ]);
            shellHook = ''
              if [ ! -d "node_modules" ]; then pnpm install; fi
              export PROJ_NIX_ENV=1
              export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}
              export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true
            '';
          };
      });
    };

}
