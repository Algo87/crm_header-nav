function dropdownInfoBlock() {

    $('.b-dropdown-wrapper').click(function () {
        // // $(this).find('.b-dropdown').toggleClass('drop-active');
        // $('.b-dropdown-user').slideUp();
        // $('.b-dropdown-user').removeClass('b-dropdown-active');
        $('.b-dropdown-user').slideUp();
        $('.b-dropdown-wrapper-user').removeClass('shadow-block');
        $('.b-dropdown-user').removeClass('b-dropdown-active');
        if ($(this).next().hasClass('b-dropdown-active')) {
            $(this).next().slideUp();
            $(this).next().removeClass('b-dropdown-active');
            $(this).parent().removeClass('shadow-block');

        } else {
            $('.b-dropdown-wrapper').parent().removeClass('shadow-block');
            $('.b-dropdown-wrapper').next().slideUp();
            $('.b-dropdown-wrapper').next().removeClass('b-dropdown-active');
            $(this).parent().addClass('shadow-block');
            $(this).next().slideDown();
            $(this).next().addClass('b-dropdown-active');
        }
    })
}

dropdownInfoBlock();

function dropdownUserBlock() {
    $('.b-dropdown-wrapper-user').click(function () {

        $('.b-dropdown-wrapper').next().slideUp();
        $('.b-dropdown-wrapper').parent().removeClass('shadow-block');
        $('.b-dropdown-wrapper').next().removeClass('b-dropdown-active');

        if ($(this).find('.b-dropdown-user').hasClass('b-dropdown-active')) {
            $(this).find('.b-dropdown-user').slideUp();
            $(this).find('.b-dropdown-user').removeClass('b-dropdown-active');
            $('.b-dropdown-wrapper-user').removeClass('shadow-block');
        } else {
            $(this).find('.b-dropdown-user').slideDown();
            $(this).find('.b-dropdown-user').addClass('b-dropdown-active');
            $('.b-dropdown-wrapper-user').addClass('shadow-block');
        }


    })
}

dropdownUserBlock();

function dropdownTabActive() {
    $('.b-dropdown-tab-header').click(function () {
        let thisWrap = $(this).next();
        $('.b-dropdown-tab-header').parent().removeClass('shadow-block');
        $(this).parent().addClass('shadow-block');
        $('.b-dropdown-tab-header').next().slideUp();

        thisWrap.slideDown();

    })
}

dropdownTabActive();

function dropdownDataSort() {

    $('.b-dropdown-tab-body-filter-btn').click(function () {

        let elWrap = $(this).next();
        console.log(elWrap);

        let elements = $(this).parent().find('.b-dropdown-tab-body-item');
        let elArray = [];

        $.each(elements, function (index, value) {
            elArray.push(value)
        });

        console.log(elArray)
        elArray.reverse();
        console.log(elArray);
        $.each(elArray, function (ind, val) {
            elWrap.append(val)
        })

    })
}

dropdownDataSort();

function textareaFocusHeight() {
    $('.new-task').find('textarea').focusout(function () {

        if ($(this).val() == '') {
            $(this).removeClass('textarea--focus');
        } else {
            $(this).addClass('textarea--focus');
        }
    })
}

textareaFocusHeight();


function addTodoItems() {
    let count = 1;
    let textarea = $('.new-task').find('textarea');
    let textareaVal;
    let textareaValTrim;

    textarea.keydown(function (e) {

        textareaVal = textarea.val();
        textareaValTrim = $.trim(textareaVal);

        if (e.ctrlKey && e.keyCode == 13) {

            if (textareaVal !== '') {

                count++;

                $('.list-todo').append('<li class="item-todo">\n' +
                    '\n' +
                    '       <input type="checkbox" id="list-todo-' + count + '" class="b-filter__el-it-input" value="list-todo-' + count + '" name="list-todo-' + count + '">\n' +
                    '       <label class="label" for="list-todo-' + count + '">' + textareaValTrim + '</label>\n' +
                    '\n' +
                    '\n' +
                    '                                </li>');

                textareaVal = '';
                textareaValTrim = '';
                $('.new-task').find('textarea').val('');
                // textarea.blur();
            } else {
                textarea.removeClass('textarea--focus');
            }

        }

    });

    checkHeaderInp();

}

addTodoItems();

function checkHeaderInp() {
    // $(elementUl).on("DOMNodeInserted", function (event) { /* ваш код */ });

    let elementUl = document.getElementById('list-todo');

    $('.new-task').find('textarea').focusout(function () {


        let elemsLi = elementUl.getElementsByClassName('label');

        $(elemsLi).off().click(function () {

            console.log($(this));

            if (!$(this).hasClass('text-through')) {

                $(this).prev().attr('checked', true);
                $(this).addClass('label-checked');
                $(this).addClass('text-through');
                $(this).css('color', '#E6E9ED');

            } else {

                $(this).prev().removeAttr('checked');
                $(this).removeClass('label-checked');
                $(this).removeClass('text-through');
                $(this).css('color', '#595959');
            }
        })

    });
}



function headerDropdownSelectInit() {

    $('.select-b-dropdown-select').select2({
        placeholder: "Введите данные"

    });
}

headerDropdownSelectInit()