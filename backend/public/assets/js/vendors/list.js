document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-list]").forEach((n) => {
        var a, s = 1, l = 10, e;

        // Label update karne ke liye (Total entries)
        function t(instance) {
            var total = instance.items.length,
                label = n.querySelector(".listjs-showing-items-label");
            if (label) label.innerHTML = total + " entries found";
        }

        // Pagination buttons toggle logic
        function i() {
            var totalPages = Math.ceil(a.items.length / a.page),
                prevBtn = n.querySelector(".prev"),
                nextBtn = n.querySelector(".next");
            if (prevBtn) prevBtn.disabled = s === 1;
            if (nextBtn) nextBtn.disabled = s === totalPages || totalPages === 0;
        }

        // Sr No. auto-increment logic
        function updateRowIndex(instance) {
            var start = instance.i; 
            instance.visibleItems.forEach((item, index) => {
                const rowElement = item.elm.querySelector(".category_index");
                if (rowElement) {
                    rowElement.innerText = start + index;
                }
            });
        }

        // Empty Table & Search Logic
        function checkEmpty(instance) {
            var noResultRow = document.getElementById("no-result-container");
            var searchInput = n.querySelector(".listjs-search");
            var placeholder = n.querySelector(".search-term-placeholder");
            var searchTerm = searchInput ? searchInput.value : "";
            
            if (placeholder) placeholder.innerText = searchTerm;

            if (instance.matchingItems.length === 0) {
                if (noResultRow) noResultRow.style.setProperty("display", "table-row-group", "important");
            } else {
                if (noResultRow) noResultRow.style.display = "none";
            }
        }

        if (n.id) {
            e = n.getAttribute("data-list").split(",").filter(v => v.trim() !== "");

            // List Initialize (With Template Fix)
            a = new List(n.id, {
                valueNames: e,
                page: 10,
                // TEMPLATE: Ye line error khatam kar degi
                item: '<tr><td class="category_index"></td><td class="review_user"></td><td class="review_product"></td><td class="review_media"></td><td class="review_rating"></td><td class="review_text"></td><td class="review_date"></td><td class="review_status"></td><td class="text-center"></td></tr>',
                searchClass: "listjs-search",
                sortClass: "listjs-sorter",
                pagination: [{
                    name: "pagination",
                    paginationClass: "pagination",
                    item: '<li class="page-item"><a class="page-link page" href="#"></a></li>',
                }],
            });

            // Initial Setup
            t(a);
            updateRowIndex(a);
            i();
            checkEmpty(a);

            // Event: Jab search ya pagination ho
            a.on("updated", function (instance) {
                t(instance);
                updateRowIndex(instance);
                i();
                checkEmpty(instance);
            });

            // Rows per page change logic
            var perPageSelect = n.querySelector(".listjs-items-per-page");
            if (perPageSelect) {
                perPageSelect.addEventListener("change", function () {
                    l = parseInt(this.value);
                    a.page = l;
                    a.update();
                    s = 1;
                    i();
                });
            }

            // Next/Prev Buttons Logic
            if (n.querySelector(".prev")) {
                n.querySelector(".prev").addEventListener("click", function () {
                    if (s > 1) {
                        s--;
                        a.show((s - 1) * l + 1, l);
                        i();
                    }
                });
            }

            if (n.querySelector(".next")) {
                n.querySelector(".next").addEventListener("click", function () {
                    if (s * l < a.items.length) {
                        s++;
                        a.show((s - 1) * l + 1, l);
                        i();
                    }
                });
            }
        }
    });
});