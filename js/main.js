// Модель отображения
var view = {
    $attachedLinksTag: $('.attached_links'),
    displayElement: function () {
        for (key in model.elementsNumber) {
            for (j = 0; j < model.elementsNumber[key]; j++) {
                $('#' + model.elementAttrAr.id[key]).append(model.elementHtml());
                $('#' + model.elementAttrAr.id[key]).find('.item').addClass(model.elementAttrAr.class[key]);
            }
        }
    },
    displaySecondElements: function () {
        this.clearSecondForm();
        for (item in list.attachedAr) {
            view.$attachedLinksTag.append(list.attachedAr[item]);
        }
        count = Object.keys(list.attachedAr).length;
        $('.attach-count span').html(count);
    },
    clearSecondForm: function () {
        view.$attachedLinksTag.empty();
    },
    clearForm: function (form) {
        form.find('input:not([type="submit"]), textarea').val('');
    },
    openDialogue: function () {
        var action = $(this).attr('action');
        var name = $('#name').val();
        var email = $('#email').val();
        var msgText = $('#msg').val();
        var totalCount = $('.attach-count > span').html();
        $.post(action, name, email, msgText, totalCount, function () {
        }).error(function (response) {
            $("#dialog").dialog({autoOpen: false, show: { effect: "blind", duration: 800}, modal: true});
            (function () {
                $("#dialog").dialog("open");
                $("#msg_name").append(document.createTextNode(name));
                $("#msg_email").append(document.createTextNode(email));
                $("#msg_message").append(document.createTextNode(msgText));
                $('#total_count').text('You`ve attached ' + totalCount + ' links');
            })();
        });
    },
    showTooltips: function () {
        $(document).tooltip({
            track: true,
            tooltipClass: "custom-tooltip-styling",
        });
    }
};

// Модель состояния

var model = {
    elementsNumber: [10, 10, 10],
    elementAttrAr: {
        id: ['ul_1a', 'ul_1b', 'ul_1c'],
        class: ['red', 'green', 'blue'],
    },
    makeName: function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
    elementHtml: function () {
        id = this.makeName();
        var semantic = '<div class="item">' +
            '<div class="checkbox"><input type="checkbox" id="' + id + '" name="' + id + '"><label for="' + id + '"></div>' +
            '<div class="content">' +
            '  <div class="cont-header">' + this.header + ' ' + id + '</div>' +
            '  <div class="cont-subtext">' + this.text + '</div>' +
            '</div>' +
            '</div>';
        return semantic;
    },
    header: "header",
    text: "some-text",
    trash: '<span task="delete"></span>',
    $slideButtonItem: '<li class="slider-button-item"></li>'
};

// Счетчики

var counter = {
    count: [],
    getCount: function (form) {
        listAll = form.find(".checkbox input").length;
        listChecked = form.find(".checkbox input:checked").length;
        this.count['all'] = listAll;
        this.count['checked'] = listChecked;
        return this.count;
    }
};

list =
{
    attachedAr: [],
    pushToSecondForm: function (input) {
        key = input.attr('id');
        item = $(input).parents('.item').clone().append(model.trash);
        this.attachedAr[key] = item;
    },
    removeFromSecondForm: function (input) {
        key = input.attr('id');
        delete this.attachedAr[key];
    },
    ckeckAll: function (currlist) {
        for (item in currlist) {
            $currentInput = $(currlist[item]).find('input');
            this.pushToSecondForm($currentInput);
            $currentInput.prop('checked', 1);
            view.displaySecondElements();
        }
    },
    clearAll: function (currlist) {
        for (item in currlist) {
            $currentInput = $(currlist[item]).find('input');
            this.removeFromSecondForm($currentInput);
            $currentInput.prop('checked', 0);
            view.displaySecondElements();
        }
    },
    unCheckedAll: function () {
        $('.first-slide input').prop('checked', false);
    }
};

// Вывод форм

view.displayElement();

// Обработчики событий

$(document).on('click', 'span[task="delete"]', function () {
    $createdInput = $(this).siblings('.checkbox').find('input');
    inpName = $createdInput.attr('name');
    $orignInput = $('.first-slide').find('input[name="' + inpName + '"]');
    $orignInput.trigger('click');
});

$('input[type=checkbox]').on("change", function () {
    $form = $(this).parents("form");
    $button = $form.find('.send');
    if ($(this).prop('checked'))
        list.pushToSecondForm($(this));
    else
        list.removeFromSecondForm($(this));
    view.displaySecondElements();

    count = counter.getCount($form);

    if (count.all > count.checked) {
        $button.text('ADD ALL');
        $button.removeClass('changer');
    }
    else {
        $button.text('REMOVE ALL');
        $button.addClass('changer');
    }
});

$('.send').on('click', function () {
    $(this).toggleClass('changer');
    currentlist = $.makeArray($(this).parent().siblings('.ul').find('.item'));
    if ($(this).hasClass('changer')) {
        $(this).text('REMOVE ALL');
        list.ckeckAll(currentlist);
    }
    else {
        $(this).text('ADD ALL');
        list.clearAll(currentlist);
    }
});

$('#form2').submit(function (event) {
    event.preventDefault();
    view.openDialogue();
    list.attachedAr = [];
    view.displaySecondElements();
    view.clearForm($(this));
    list.unCheckedAll();
    $('.send').removeClass('changer').text('ADD ALL');
    return false;
});

$('body').on('click', '.slider-button-item', function () {
    activeSlideNum = $('.slider-item.active').index();
    currentSlideNum = $(this).index();
    if (activeSlideNum == currentSlideNum)
        return false;
    view.listSlide(currentSlideNum);
});

//Свайпер
var mySwiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    loop: false,
    pagination: '.swiper-pagination',
    paginationClickable: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    keyboardControl: true,
})

//Тултипы второй формы
view.showTooltips();
