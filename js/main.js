document.addEventListener('DOMContentLoaded', () => {
    // Splash Screen Management
    const splashScreen = document.querySelector('.splash-screen');
    const splashLogo = document.querySelector('.splash-logo');
    // Target the new HERO logo instead of the hidden header logo
    const targetLogo = document.querySelector('.hero-logo');
    const splashCircle = document.querySelector('.splash-circle');

    if (splashScreen && splashLogo && targetLogo) {
        // Initial state: Hide target logo so we can fly the splash logo there
        targetLogo.style.opacity = '0';

        // Wait for the reveal animation to largely complete
        setTimeout(() => {
            // 1. Get Geometry
            const startRect = splashLogo.getBoundingClientRect();
            const endRect = targetLogo.getBoundingClientRect();

            // 2. Calculate Deltas
            const deltaX = endRect.left - startRect.left;
            const deltaY = endRect.top - startRect.top;

            // Note: We need to account for centering.
            // Element coords are top-left based. transforms are often center based depending on CSS.
            // But usually translate moves the element visually.
            // Scale:
            const scale = endRect.width / startRect.width;

            // 3. Apply Transition to Splash Logo
            splashLogo.style.transition = 'transform 1s cubic-bezier(0.68, -0.55, 0.27, 1.55)'; // Elastic-ishe
            splashLogo.style.transformOrigin = 'top left'; // Easier math aligns top-left corners
            splashLogo.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;

            // 4. Transform Circle (Red Background) to follow and shrink
            splashScreen.style.backgroundColor = 'transparent';
            if (splashCircle) {
                // Calculate centers
                const navCenter = {
                    x: endRect.left + endRect.width / 2,
                    y: endRect.top + endRect.height / 2
                };
                const screenCenter = {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2
                };

                const circleDeltaX = navCenter.x - screenCenter.x;
                const circleDeltaY = navCenter.y - screenCenter.y;

                // CRITICAL FIX: To transition FROM a keyframe state TO a new JS state,
                // we must explicit set the start state and force a browser reflow.

                // 1. Lock starting state
                splashCircle.style.transition = 'none';
                splashCircle.style.transform = 'scale(200)';

                // 2. Force Repaint/Reflow (accessing a layout prop)
                splashCircle.getBoundingClientRect();

                // 3. Apply transition and target state
                // Use standard ease-in-out to prevent "bouncing" artifacts with large scales
                splashCircle.style.transition = 'transform 1.2s ease-in-out';
                splashCircle.style.transformOrigin = 'center center';
                splashCircle.style.transform = `translate(${circleDeltaX}px, ${circleDeltaY}px) scale(0)`;
            }
            // Remove pointer events immediately so user can click header if needed
            splashScreen.style.pointerEvents = 'none';

            // 5. Cleanup after transition
            setTimeout(() => {
                targetLogo.style.transition = 'opacity 0.3s ease';
                targetLogo.style.opacity = '1';
                splashScreen.remove(); // Remove from DOM
            }, 1000); // Wait for transition(1s) to finish

        }, 2000); // Wait 2s before starting the move (let the red circle breathe)
    }

    // Navbar active state toggler
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Form submission default prevent
    const form = document.querySelector('.hero-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input').value;
            alert(`Gracias! Te contactaremos a: ${email}`);
            form.reset();
        });
    }
});
