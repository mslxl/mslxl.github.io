{
  description = "astro env";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };
  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forEachSupportedSystem = f: nixpkgs.lib.genAttrs supportedSystems (system: f {
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
              tinymist
              mdl

              shellcheck
             
              nodejs
              nodejs.pkgs.pnpm
            ]);
            # Fontconfig error: Cannot load default config file
            FONTCONFIG_FILE = pkgs.makeFontsConf {
              fontDirectories = with pkgs; [
                nerd-fonts.iosevka
                source-han-sans
                source-han-serif
              ];
            };
            shellHook = ''
              if [ ! -d "node_modules" ]; then pnpm install; fi
              export PROJ_NIX_ENV=1

              export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}
              # export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true

              # playwright_chromium_revision="$(${pkgs.jq}/bin/jq --raw-output '.browsers[] | select(.name == "chromium").revision' ${pkgs.playwright-driver}/browsers.json)"
              # export PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH=${pkgs.playwright-driver.browsers}/chromium-$playwright_chromium_revision/chrome-linux/chrome
              # export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=$PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH

              env | grep ^PLAYWRIGHT
            '';
          };
      });
    };

}
