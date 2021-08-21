describe ('Evaluate CEA algorithm', () => {
    before (() => {
        cy.intercept('GET', '**complete/search?*').as('load')
        cy.visit('/');
        cy.wait('@load');
    });

    const firstSearchTerm = 'Software';
    // Enter "Software" as the search term
    it ('software', () => {
        cy.get('input[title="Search"]').type(`${firstSearchTerm}{enter}`);
        cy.get(`div[data-async-context="query:${firstSearchTerm}"]`).find("h2:contains('Web results')").eq(0).parent().find('h3').then($res => {
             expect($res.eq(0).text()).to.eq(`${firstSearchTerm} - Wikipedia`);
        });
    });

    // Do a new search. Use "Literature" as a search term
    it ('literature', () => {
        const secondSearchTerm = 'Literature';
        const britanicaHref = "https://www.britannica.com/art/literature";
        cy.get('span[aria-label="Clear"]').click();
        cy.get('input[aria-label="Search"]').type(`${secondSearchTerm}{enter}`);

        // Validate "britannica.com" is returned in the search result;
        cy.get(`a[href="${britanicaHref}"]`).should('exist');

        // and display the position or index of the result
        cy.get(`div[data-async-context="query:${secondSearchTerm}"] > div[class="g"]`).find('h3').parent().then($res => {
            for (let i = 0; i < $res.length; i++) {
                if ($res[i].getAttribute('href') === britanicaHref) {
                    cy.log(`Position of Britanica.com is ${i + 1}`);
                }
            }
        });
    })
})