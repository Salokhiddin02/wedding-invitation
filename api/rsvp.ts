interface RsvpBody {
  attendance?: unknown;
  guestCount?: unknown;
}

export default {
  async fetch(request: Request): Promise<Response> {

    if (request.method !== 'POST') {
      return Response.json(
        {
          success: false,
          message: 'Faqat POST so‘roviga ruxsat beriladi.'
        },
        {
          status: 405,
          headers: {
            'Allow': 'POST'
          }
        }
      );
    }

    try {
      const body = await request.json() as RsvpBody;

      const attendance =
        body.attendance === 'yes'
          ? 'yes'
          : body.attendance === 'no'
            ? 'no'
            : null;

      const guestCount = Number(body.guestCount);

      if (!attendance) {
        return Response.json(
          {
            success: false,
            message: 'Kelish holati noto‘g‘ri.'
          },
          {
            status: 400
          }
        );
      }

      if (
        attendance === 'yes' &&
        (
          !Number.isInteger(guestCount) ||
          guestCount < 1 ||
          guestCount > 20
        )
      ) {
        return Response.json(
          {
            success: false,
            message: 'Mehmonlar soni 1 dan 20 gacha bo‘lishi kerak.'
          },
          {
            status: 400
          }
        );
      }

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        console.error(
          'TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID topilmadi.'
        );

        return Response.json(
          {
            success: false,
            message: 'Telegram server sozlamalari topilmadi.'
          },
          {
            status: 500
          }
        );
      }

      const currentTime = new Intl.DateTimeFormat(
        'uz-UZ',
        {
          timeZone: 'Asia/Tashkent',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }
      ).format(new Date());

      const message =
        attendance === 'yes'
          ? [
              '💌 Yangi RSVP javobi',
              '',
              '✅ To‘yga keladi',
              `👥 Mehmonlar soni: ${guestCount} kishi`,
              '',
              '💍 Azamat & Zulayxo',
              '📅 19.07.2026',
              `🕒 ${currentTime}`
            ].join('\n')
          : [
              '💌 Yangi RSVP javobi',
              '',
              '❌ To‘yga kela olmaydi',
              '',
              '💍 Azamat & Zulayxo',
              '📅 19.07.2026',
              `🕒 ${currentTime}`
            ].join('\n');

      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message
          })
        }
      );

      const telegramResult = await telegramResponse.json() as {
        ok?: boolean;
        description?: string;
      };

      if (!telegramResponse.ok || !telegramResult.ok) {
        console.error(
          'Telegram API xatosi:',
          telegramResult
        );

        return Response.json(
          {
            success: false,
            message:
              telegramResult.description ||
              'Telegram guruhiga xabar yuborilmadi.'
          },
          {
            status: 502
          }
        );
      }

      return Response.json(
        {
          success: true,
          message: 'Javob muvaffaqiyatli yuborildi.'
        },
        {
          status: 200
        }
      );

    } catch (error) {
      console.error('RSVP funksiyasi xatosi:', error);

      return Response.json(
        {
          success: false,
          message: 'Serverda kutilmagan xatolik yuz berdi.'
        },
        {
          status: 500
        }
      );
    }
  }
};