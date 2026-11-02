# Intro sting (15 s, original)

Source of `public/reel/intro.mp4`, the first Showreel clip.

    npm i --no-save playwright-core
    node build.mjs                                   # inlines fonts from ~/Library/Fonts -> intro.html
    node render.mjs intro.html out/intro.mp4 60 4 8              # 1920x1080
    QS='&sq' node render.mjs intro.html out/intro_sq.mp4 60 4 8  # 1080x1080 for the site

Open `intro.html` in a browser to scrub it. Fonts: Anton, JetBrains Mono, Instrument Serif.
